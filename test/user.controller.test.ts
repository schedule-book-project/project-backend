import request from 'supertest';
import app from '../microservices/user/src/server';

describe('User Controller', () => {
  describe('POST /register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/user/register')
        .send({
          name: 'Test User',
          email: 'testuser@example.com',
          password: 'password123',
          role: 'customer',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('user');
    });

    it('should return validation errors for invalid input', async () => {
      const response = await request(app)
        .post('/api/user/register')
        .send({
          email: 'invalid-email',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /login', () => {
    it('should log in a user with valid credentials', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: 'testuser@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    it('should return an error for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: 'testuser@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });
});
