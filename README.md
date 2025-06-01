# scheduleaway

Prerequisites:

- [NodeJS](https://nodejs.org/en) Latest LTS version
- [MongoDB](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-community-with-docker/) Latest version 
- (optional) [Bun](https://bun.sh) package manager

To install dependencies:

```bash
npm run init
# or you can use bun if you prefer it
npm run init:bun
```

For clean install use:

```bash 
npm run clean-install
# or
npm run clean-install:bun
```

To build 

```bash
npm run build
# or 
npm run build:bun
```


To run:

```bash
npm run start
# or 
npm run start:bun
```

If MongoDB is not running, start it with:

```bash
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

Run this command to see which process is using port 5000:

On macOS/Linux:
```bash
lsof -i :5000
```
Then, kill the process using:
```bash
kill -9 <PID>
```
Replace <PID> with the process ID from the lsof output.

On Windows:
```bash
netstat -ano | findstr :5000
```

Then, kill the process with:
```bash
taskkill /PID <PID> /F
```

# HERE Maps API
In order to use the HERE Maps you have to follow the following steps:
- https://platform.here.com/access/apps
- Click on **Create new app** button
- Add an app name (e.g BookIT 4U)
- Store the create api key to the env variable **HERE_API_KEY**

---

## API Documentation (Swagger)

### Overview
This project uses a centralized Swagger UI hosted on the API Gateway to provide comprehensive documentation for all microservice APIs. This allows developers and consumers to easily discover and interact with the available endpoints.

### Accessing the Documentation
-   **Unified Swagger UI:** Available at `/api-docs` on the API Gateway.
    *   Example (if running locally with default ports): `http://localhost:5000/api-docs`
-   **Aggregated OpenAPI JSON:** The raw aggregated OpenAPI 3.0 specification can be found at `/api-docs/openapi.json` on the API Gateway.
    *   Example (if running locally): `http://localhost:5000/api-docs/openapi.json`

### How it Works
1.  **Individual Microservice Specs:** Each microservice (e.g., User, Booking, Business) is responsible for generating its own OpenAPI specification. This is achieved by using `swagger-jsdoc` to parse JSDoc comments embedded in the route files (`*.routes.ts`) and model files (`*.model.ts`).
2.  **Service-Level Endpoint:** Each microservice exposes its generated specification as a JSON file at its own `/api-docs.json` endpoint (e.g., `http://localhost:5001/api-docs.json` for the User service).
3.  **API Gateway Aggregation:** The API Gateway includes a service (`swaggerAggregator.service.ts`) that:
    *   Fetches the `/api-docs.json` from each registered microservice.
    *   Merges these individual specifications into a single, unified OpenAPI document.
    *   It intelligently prefixes paths based on how the gateway routes requests to the underlying services (e.g., a `/users` path in the User service spec becomes `/user/users` in the aggregated spec, matching the gateway's routing).
    *   It uses a shared base Swagger definition (`shared/swagger/baseDefinition.ts`) for common elements like OpenAPI version, global security schemes (JWT Bearer Auth), and initial information.
4.  **Serving the UI:** The API Gateway uses `swagger-ui-express` to serve the interactive Swagger UI, populated with the aggregated specification.

### Contributing to API Documentation (For Developers)
Accurate and up-to-date API documentation is crucial. Follow these guidelines when adding or modifying APIs:

1.  **JSDoc Annotations:**
    *   All new or updated API routes **must** include JSDoc comments using `@openapi` tags. This includes defining tags, summaries, parameters (path, query, header), request bodies, and responses for each HTTP method.
    *   Reference shared error schemas (e.g., `BadRequestError`, `NotFoundError`) from `shared/models/error.model.ts` where applicable.
2.  **Schema Definitions:**
    *   Define request payload and response object schemas within the relevant `*.model.ts` file of your microservice using JSDoc `@openapi` syntax (e.g., `UserResponse`, `BookingCreationPayload`).
    *   Shared schemas, such as common error responses (`ErrorResponse`, `NotFoundError`, etc.), are defined in `shared/models/error.model.ts` and should be referenced using `$ref: '#/components/schemas/SchemaName'`.
3.  **Service Documentation Endpoint (`docs.routes.ts`):**
    *   Ensure your microservice's `docs.routes.ts` file correctly lists all relevant route files and model files (including any shared models like `shared/models/error.model.ts`) in its `apiFiles` array. This array is used by `generateSwaggerSpec` to find JSDoc comments.
    *   Update the `servers` array in the `serviceDefinition` within your service's `docs.routes.ts` to reflect its correct base URL.
4.  **API Gateway Registry:**
    *   If adding a **new microservice**, it must be registered in `microservices/api-gateway/src/config/serviceRegistry.ts`. Add an entry with its `docsUrl` (pointing to its `/api-docs.json`) and `gatewayPathPrefix` (the prefix used by the gateway to route to this service, e.g., `/new-service`).
5.  **Verification:**
    *   After making changes, run your microservice locally and verify its individual `/api-docs.json` endpoint for correctness.
    *   Then, run the API Gateway and check the aggregated Swagger UI at `/api-docs` to ensure your service's documentation is correctly merged and displayed. Pay attention to path prefixes and schema references.

#### Example JSDoc for a Route:
```typescript
/**
 * @openapi
 * /api/users/{id}:  // Note: Path should be relative to service root for individual spec
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse' // Defined in user.model.ts
 *       404:
 *         $ref: '#/components/responses/NotFoundError' // Defined in shared/models/error.model.ts
 */
// router.get('/:id', ...);
```

#### Example JSDoc for a Schema:
```typescript
/**
 * @openapi
 * components:
 *   schemas:
 *     MyCustomResponse:
 *       type: object
 *       properties:
 *         customId:
 *           type: string
 *           example: 'cust_123'
 *         value:
 *           type: number
 *           example: 42
 */
// export interface MyCustomResponse { ... }
```
