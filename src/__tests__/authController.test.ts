import request from 'supertest';
import { createTestApp, setupDatabase, teardownDatabase } from './testSetup';
import { User } from '../models';

const app = createTestApp();

describe('Auth Controller', () => {
  beforeAll(async () => {
    await setupDatabase();
  });

  afterAll(async () => {
    await teardownDatabase();
  });

  beforeEach(async () => {
    // Clean up users
    await User.destroy({ where: {} });
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'StrongPassword123!',
      };

      const response = await request(app).post('/auth/register').send(userData).expect(201);

      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.username).toBe(userData.username);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.role).toBe('user');
    });

    it('should return error for weak password', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: '123',
      };

      const response = await request(app).post('/auth/register').send(userData).expect(400);

      expect(response.body.error).toBe('Password is too weak');
    });

    it('should return error for missing fields', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
      };

      const response = await request(app).post('/auth/register').send(userData).expect(400);

      expect(response.body.error).toBe('Username, email, and password are required');
    });

    it('should return error for duplicate email', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'StrongPassword123!',
      };

      // Register first user
      await request(app).post('/auth/register').send(userData).expect(201);

      // Try to register again
      const response = await request(app).post('/auth/register').send(userData).expect(400);

      expect(response.body.error).toBe('User with this email already exists');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'StrongPassword123!',
        role: 'user',
      });
    });

    it('should login successfully with correct credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'StrongPassword123!',
      };

      const response = await request(app).post('/auth/login').send(loginData).expect(200);

      expect(response.body.message).toBe('Login successful');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user.email).toBe(loginData.email);
    });

    it('should return error for invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'WrongPassword123!',
      };

      const response = await request(app).post('/auth/login').send(loginData).expect(401);

      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should return error for non-existent user', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'StrongPassword123!',
      };

      const response = await request(app).post('/auth/login').send(loginData).expect(401);

      expect(response.body.error).toBe('Invalid credentials');
    });
  });

  describe('GET /auth/profile', () => {
    let accessToken: string;

    beforeEach(async () => {
      // Create a test user and get token
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'StrongPassword123!',
        role: 'user',
      });

      const loginResponse = await request(app).post('/auth/login').send({
        email: 'test@example.com',
        password: 'StrongPassword123!',
      });

      accessToken = loginResponse.body.accessToken;
    });

    it('should access profile with valid token', async () => {
      const response = await request(app)
        .get('/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.message).toBe('Profile accessed successfully');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should return error without token', async () => {
      const response = await request(app).get('/auth/profile').expect(401);

      expect(response.body.error).toBe('Access token required');
    });

    it('should return error with invalid token', async () => {
      const response = await request(app)
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(403);

      expect(response.body.error).toBe('Invalid or expired token');
    });
  });
});
