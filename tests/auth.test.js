import request from 'supertest';
import app from '../app.js'; // Ajuste ce chemin !

describe('Auth API', () => {
  it('should register a new user successfully', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'testuser@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'testpassword123',
        confirmPassword: 'testpassword123'
      });

    expect(response.statusCode).toBe(201); 
    expect(response.body).toHaveProperty('message');
  });

  it('should not register a user with invalid data', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'invalid-email',
        password: 'short',
        confirmPassword: 'short'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message');
  });
});
