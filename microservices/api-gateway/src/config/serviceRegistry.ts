interface ServiceConfig {
  healthUrl: string;
  docsUrl: string;
  gatewayPathPrefix: string; // Path prefix used by the API gateway
}

interface ServiceRegistry {
  [serviceName: string]: ServiceConfig;
}

// Default to localhost and specific ports from dev.env
// In a real environment, these would come from a config service or environment variables
export const serviceRegistry: ServiceRegistry = {
  userService: {
    healthUrl: `http://localhost:5001/health`,
    docsUrl: `http://localhost:5001/api-docs.json`,
    gatewayPathPrefix: '/user', // As defined in gateway.routes.ts (e.g., /api/user -> /user)
  },
  businessService: {
    healthUrl: `http://localhost:5002/health`,
    docsUrl: `http://localhost:5002/api-docs.json`,
    gatewayPathPrefix: '/business',
  },
  bookingService: {
    healthUrl: `http://localhost:5003/health`,
    docsUrl: `http://localhost:5003/api-docs.json`,
    gatewayPathPrefix: '/booking',
  },
  reviewService: {
    healthUrl: `http://localhost:5004/health`,
    docsUrl: `http://localhost:5004/api-docs.json`,
    gatewayPathPrefix: '/review',
  },
  placesService: {
    healthUrl: `http://localhost:5005/health`,
    docsUrl: `http://localhost:5005/api-docs.json`,
    gatewayPathPrefix: '/places',
  },
  // Note: The admin service is mentioned in gateway.routes.ts but not in the list of services
  // to create /health or /api-docs.json for. If it had one, it would be here too.
  // e.g. adminService: { healthUrl: ..., docsUrl: ..., gatewayPathPrefix: '/admin' }
};

export default serviceRegistry;
