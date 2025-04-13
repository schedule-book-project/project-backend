import {glob} from 'glob';
import path from 'path';

export function loadSchemas() {
    const schemaPaths = glob.sync(
        'microservices/**/src/models/*.model.ts',
        {absolute: true}
    );

    const schemas: { [key: string]: any } = {};

    return schemaPaths.reduce((schemas, filePath) => {
        const serviceName = path.basename(filePath, '.model.ts');
        schemas[serviceName] = require(filePath).swaggerSchema;
        return schemas;
    }, schemas);
}