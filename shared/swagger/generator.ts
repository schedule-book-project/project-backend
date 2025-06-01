import swaggerJSDoc from 'swagger-jsdoc';
import { baseSwaggerOptions } from './baseDefinition';
import deepmerge from 'deepmerge'; // To intelligently merge base and custom definitions

/**
 * Generates a Swagger specification for a given service.
 *
 * @param serviceName - The name of the service (e.g., "User Service").
 * @param apiFiles - An array of glob patterns pointing to API route and model files.
 * @param serviceDefinition - Optional service-specific Swagger definition parts to override or extend base options.
 * @returns The generated Swagger specification object.
 */
export const generateSwaggerSpec = (
  serviceName: string,
  apiFiles: string[],
  serviceDefinition?: any, // Allow any structure for flexibility in overrides
) => {
  // Start with a deep copy of base options, then merge service-specific definitions
  let definition = deepmerge(baseSwaggerOptions, serviceDefinition || {});

  // Customize title
  if (serviceName) {
    definition.info.title = `BookIt4You - ${serviceName}`;
  }

  const options = {
    definition: definition,
    apis: apiFiles, // Glob patterns to find JSDoc comments
  };

  try {
    const swaggerSpec = swaggerJSDoc(options);
    return swaggerSpec;
  } catch (error) {
    console.error(`Error generating Swagger spec for ${serviceName}:`, error);
    // Return a minimal valid spec or rethrow, depending on desired error handling
    return {
      openapi: '3.0.0',
      info: {
        title: `Error Generating Spec for ${serviceName}`,
        version: '0.0.0',
        description: (error instanceof Error ? error.message : String(error)),
      },
      paths: {},
    };
  }
};

export default generateSwaggerSpec;
