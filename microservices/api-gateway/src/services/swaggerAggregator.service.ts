import axios from 'axios';
import deepmerge from 'deepmerge';
import { serviceRegistry } from '../config/serviceRegistry';
import { baseSwaggerOptions } from '@shared/swagger/baseDefinition'; // Path to shared base definition
import logger from '@shared/logger/logger'; // Path to shared logger
import envVars from '@shared/config/env.validation'; // To get GATEWAY_PORT

// Helper to create a deep copy to avoid modifying baseSwaggerOptions
const deepCopy = (obj: any) => JSON.parse(JSON.stringify(obj));

export const aggregateSwaggerSpecs = async (): Promise<any> => {
  const mergedSpec = deepCopy(baseSwaggerOptions);

  // Customize info for the aggregated spec
  mergedSpec.info.title = 'BookIt4You - Aggregated API Gateway';
  mergedSpec.info.description = 'This is the aggregated API documentation for all BookIt4You microservices, accessible via the API Gateway.';

  // Set the server URL for the API Gateway
  // The /api prefix is handled by how routes are mounted in gateway's server.ts
  mergedSpec.servers = [{ url: `http://localhost:${envVars.GATEWAY_PORT}/api`, description: 'API Gateway' }];

  // Initialize/reset parts of the spec that will be aggregated
  mergedSpec.paths = {};
  mergedSpec.tags = [];
  // Keep base securitySchemes, but ensure schemas is an empty object to start fresh for aggregation
  mergedSpec.components.schemas = {};
  // mergedSpec.components.responses = {}; // If you have shared gateway-level responses
  // mergedSpec.components.parameters = {}; // If you have shared gateway-level parameters

  const existingTags = new Set<string>();

  for (const serviceName in serviceRegistry) {
    if (Object.prototype.hasOwnProperty.call(serviceRegistry, serviceName)) {
      const serviceConfig = serviceRegistry[serviceName];
      try {
        logger.info(`Fetching Swagger spec for ${serviceName} from ${serviceConfig.docsUrl}`);
        const response = await axios.get(serviceConfig.docsUrl, { timeout: 5000 });
        const serviceSpec = response.data;

        if (!serviceSpec || !serviceSpec.paths) {
          logger.warn(`No paths found in Swagger spec for ${serviceName} from ${serviceConfig.docsUrl}`);
          continue;
        }

        // Merge Paths with gateway prefix
        for (const pathKey in serviceSpec.paths) {
          if (Object.prototype.hasOwnProperty.call(serviceSpec.paths, pathKey)) {
            const newPathKey = `${serviceConfig.gatewayPathPrefix}${pathKey.startsWith('/') ? '' : '/'}${pathKey}`.replace(/\/+/g, '/');
            mergedSpec.paths[newPathKey] = serviceSpec.paths[pathKey];
            // TODO: Update $refs within path definitions if they point to local service schemas - this is complex
          }
        }

        // Merge Components (Schemas) - Simpler approach: direct merge, risk of collision
        // A more robust approach would prefix schemas, e.g., User_UserResponse
        // and update all $refs. For now, direct merge.
        if (serviceSpec.components && serviceSpec.components.schemas) {
          mergedSpec.components.schemas = deepmerge(mergedSpec.components.schemas, serviceSpec.components.schemas);
        }

        // Merge other components if necessary (e.g., responses, parameters)
        // if (serviceSpec.components && serviceSpec.components.responses) {
        //   mergedSpec.components.responses = deepmerge(mergedSpec.components.responses || {}, serviceSpec.components.responses);
        // }
        // if (serviceSpec.components && serviceSpec.components.parameters) {
        //   mergedSpec.components.parameters = deepmerge(mergedSpec.components.parameters || {}, serviceSpec.components.parameters);
        // }


        // Merge Tags (ensuring uniqueness)
        if (serviceSpec.tags && Array.isArray(serviceSpec.tags)) {
          serviceSpec.tags.forEach((tag: { name: string }) => {
            if (!existingTags.has(tag.name)) {
              mergedSpec.tags.push(tag);
              existingTags.add(tag.name);
            }
          });
        }

        logger.info(`Successfully merged Swagger spec for ${serviceName}`);

      } catch (error) {
        logger.error(`Failed to fetch or merge Swagger spec for ${serviceName} from ${serviceConfig.docsUrl}`, {
          errorMessage: error instanceof Error ? error.message : String(error),
          // stack: error instanceof Error ? error.stack : undefined // Optional: log stack
        });
        // Optionally, add a placeholder in the spec indicating this service's spec failed to load
        mergedSpec.paths[`/${serviceName.replace('Service', '').toLowerCase()}/docs-error`] = {
          get: {
            summary: `Error loading API docs for ${serviceName}`,
            tags: [serviceName],
            responses: {
              '500': { description: `Could not retrieve API specification from ${serviceConfig.docsUrl}` }
            }
          }
        };
      }
    }
  }
  // Sort tags alphabetically for cleaner output
  mergedSpec.tags.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));

  return mergedSpec;
};
