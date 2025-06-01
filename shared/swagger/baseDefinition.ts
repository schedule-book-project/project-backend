// Base Swagger definition for consistent API documentation structure.

export const baseSwaggerOptions = {
  openapi: '3.0.0',
  info: {
    title: 'BookIt4You API Platform',
    version: '1.0.0', // This could be a shared platform version or overridden by services
    description:
      'Aggregated API documentation for all BookIt4You microservices. Specific service details may be appended by each microservice.',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    // Schemas can be added here globally or by individual services
    // For example, common error responses defined in shared/models
    schemas: {},
  },
  security: [
    {
      bearerAuth: [], // Applies JWT authentication globally by default
    },
  ],
  servers: [], // Services should populate this with their specific URLs
};

export default baseSwaggerOptions;
