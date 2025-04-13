import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import type {Express} from 'express';
import { loadSchemas } from './schemaLoader';


export const SWAGGER_OPTIONS = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bookit4You API',
      version: '1.0.0',
      description: 'Microservices API Documentation',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local Development' },
    ],
    components: {
      schemas: loadSchemas(),
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./microservices/*/src/routes/*.ts'],
};

export function setupSwagger(app: Express, serviceName: string) {
  const options = {
    ...SWAGGER_OPTIONS,
    definition: {
      ...SWAGGER_OPTIONS.definition,
      info: {
        ...SWAGGER_OPTIONS.definition.info,
        title: `${serviceName} API`,
      },
    },
  };

  const specs = swaggerJSDoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}