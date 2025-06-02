import request from 'supertest';
import app from '../src/server'; // Assuming app is exported from server.ts
import { serviceRegistry } from '../src/config/serviceRegistry'; // To get expected service names

// It's often good to explicitly close the server after tests if it's started.
// However, supertest usually handles this for Express apps if 'app' is the listener.
// If server.ts starts listening and exports the http.Server instance, we'd use that.
// For now, assuming 'app' is the express app instance.

describe('GET /api/health-aggregated', () => {
  it('should return 200 OK and aggregated health status of all services', async () => {
    const response = await request(app).get('/api/health-aggregated');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);

    const expectedServiceNames = Object.keys(serviceRegistry);
    expect(Object.keys(response.body)).toEqual(
      expect.arrayContaining(expectedServiceNames),
    );
    expect(expectedServiceNames.length).toBe(Object.keys(response.body).length);


    for (const serviceName of expectedServiceNames) {
      const serviceHealth = response.body[serviceName];
      expect(serviceHealth).toBeInstanceOf(Object);
      expect(serviceHealth).toHaveProperty('status');
      expect(typeof serviceHealth.status).toBe('string');
      expect(['UP', 'DOWN']).toContain(serviceHealth.status);
      expect(serviceHealth).toHaveProperty('version');
      expect(typeof serviceHealth.version).toBe('string');
    }
  });

  // TODO: Add a test case that mocks individual service health endpoints
  // to verify "DOWN" status and specific versions if possible/needed.
  // This would involve using jest.mock for axios or a more complex setup.
});
