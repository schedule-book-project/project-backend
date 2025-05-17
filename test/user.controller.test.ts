import request from 'supertest';
import userServer from '../microservices/user/src/server';

describe('User Controller', () => {
  describe('POST /register', () => {
    it('should register a new user', async () => {
      const response = await request(userServer)
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
      const response = await request(userServer)
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
      const response = await request(userServer)
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
      const response = await request(userServer)
        .post('/api/user/login')
        .send({
          email: 'testuser@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Input Sanitization', () => {
    it('should sanitize user inputs during registration', async () => {
      const response = await request(userServer)
        .post('/api/user/register')
        .send({
          name: '<script>alert("XSS")</script>',
          email: 'testuser@example.com',
          password: 'password123',
          role: 'customer',
        });

      expect(response.status).toBe(201);
      expect(response.body.user.name).not.toContain('<script>');
    });
  });

  describe('Error Handling', () => {
    it('should log and return an error for missing fields', async () => {
      const response = await request(userServer)
        .post('/api/user/register')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });
});
