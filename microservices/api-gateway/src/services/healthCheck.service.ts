import axios from 'axios';
import serviceRegistry from '../config/serviceRegistry';
import logger from '@shared/logger/logger'; // Use path alias

interface HealthStatus {
  status: string;
  version: string;
}

interface AllHealthStatus {
  [serviceName: string]: HealthStatus;
}

export const checkAllServicesHealth = async (): Promise<AllHealthStatus> => {
  const allStatuses: AllHealthStatus = {};

  for (const serviceName in serviceRegistry) {
    if (Object.prototype.hasOwnProperty.call(serviceRegistry, serviceName)) {
      const url = serviceRegistry[serviceName];
      try {
        const response = await axios.get<HealthStatus>(url, { timeout: 5000 }); // 5 second timeout
        if (response.status === 200 && response.data) {
          allStatuses[serviceName] = {
            status: response.data.status || 'UP', // Default to UP if status field missing but 200 OK
            version: response.data.version || 'unknown',
          };
        } else {
          // Non-200 response but not an axios error
          logger.warn(`Service ${serviceName} health check returned status ${response.status}`, { url });
          allStatuses[serviceName] = {
            status: 'DOWN',
            version: 'unknown',
          };
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          logger.error(`Error checking health of ${serviceName} at ${url}: ${error.message}`, {
            serviceName,
            url,
            errorCode: error.code,
            responseStatus: error.response?.status,
          });
        } else {
          logger.error(`Unknown error checking health of ${serviceName} at ${url}`, { error });
        }
        allStatuses[serviceName] = {
          status: 'DOWN',
          version: 'unknown',
        };
      }
    }
  }
  return allStatuses;
};
