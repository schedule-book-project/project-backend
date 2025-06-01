import { glob } from 'glob';
import path from 'path';

export function loadSchemas(): { [key: string]: unknown } {
  const schemaPaths = glob.sync('microservices/**/src/models/*.model.ts', {
    absolute: true,
  });

  const schemas: { [key: string]: unknown } = {};

  return schemaPaths.reduce((schemas, filePath) => {
    const serviceName = path.basename(filePath, '.model.ts');
    schemas[serviceName] = require(filePath).swaggerSchema;
    return schemas;
  }, schemas);
}
