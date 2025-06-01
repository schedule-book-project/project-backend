import { glob } from 'glob';
import path from 'path';

export async function loadSchemas(): Promise<{ [key: string]: unknown }> {
  const schemaPaths = glob.sync('microservices/**/src/models/*.model.ts', {
    absolute: true,
  });

  const schemas: { [key: string]: unknown } = {};

  for (const filePath of schemaPaths) {
    const serviceName = path.basename(filePath, '.model.ts');
    // Use dynamic import for ES modules
    const module = await import(filePath);
    schemas[serviceName] = module.swaggerSchema;
  }
  return schemas;
}
