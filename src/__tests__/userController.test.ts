import request from 'supertest';
import { createTestApp, setupDatabase, teardownDatabase } from './testSetup';
import { User } from '../models';

const app = createTestApp();

describe('User Controller (Admin Routes)', () => {
  let adminToken: string;
  let userToken: string;
  let adminUser: User;
  let regularUser: User;

  beforeAll(async () => {
    await setupDatabase();
  });

  afterAll(async () => {
    await teardownDatabase();
  });

  beforeEach(async () => {
    // Clean up users
    await User.destroy({ where: {} });

    // Create admin user
    adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'AdminPassword123!',
      role: 'admin',
    });

    // Create regular user
    regularUser = await User.create({
      username: 'user',
      email: 'user@example.com',
      password: 'UserPassword123!',
      role: 'user',
    });

    // Get admin token
    const adminLoginResponse = await request(app).post('/auth/login').send({
      email: 'admin@example.com',
      password: 'AdminPassword123!',
    });

    adminToken = adminLoginResponse.body.accessToken;

    // Get user token
    const userLoginResponse = await request(app).post('/auth/login').send({
      email: 'user@example.com',
      password: 'UserPassword123!',
    });

    userToken = userLoginResponse.body.accessToken;
  });

  describe('GET /users', () => {
    it('should return all users for admin', async () => {
      const response = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.users).toHaveLength(2);
      expect(response.body.users[0]).toHaveProperty('username');
      expect(response.body.users[0]).toHaveProperty('email');
      expect(response.body.users[0]).toHaveProperty('role');
    });

    it('should return error for non-admin user', async () => {
      const response = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.error).toBe('Insufficient permissions');
    });

    it('should return error without authentication', async () => {
      const response = await request(app).get('/users').expect(401);

      expect(response.body.error).toBe('Access token required');
    });
  });

  describe('GET /users/:id', () => {
    it('should return user by ID for admin', async () => {
      const response = await request(app)
        .get(`/users/${regularUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.user.id).toBe(regularUser.id);
      expect(response.body.user.username).toBe(regularUser.username);
      expect(response.body.user.email).toBe(regularUser.email);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/users/999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.error).toBe('User not found');
    });

    it('should return error for non-admin user', async () => {
      const response = await request(app)
        .get(`/users/${regularUser.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.error).toBe('Insufficient permissions');
    });
  });

  describe('PUT /users/:id', () => {
    it('should update user for admin', async () => {
      const updateData = {
        username: 'updateduser',
        email: 'updated@example.com',
        role: 'moderator',
      };

      const response = await request(app)
        .put(`/users/${regularUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.message).toBe('User updated successfully');
      expect(response.body.user.username).toBe(updateData.username);
      expect(response.body.user.email).toBe(updateData.email);
      expect(response.body.user.role).toBe(updateData.role);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .put('/users/999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ username: 'test' })
        .expect(404);

      expect(response.body.error).toBe('User not found');
    });

    it('should return error for non-admin user', async () => {
      const response = await request(app)
        .put(`/users/${regularUser.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ username: 'test' })
        .expect(403);

      expect(response.body.error).toBe('Insufficient permissions');
    });
  });

  describe('GET /admin/dashboard', () => {
    it('should access admin dashboard for admin', async () => {
      const response = await request(app)
        .get('/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.message).toBe('Welcome to the admin dashboard');
      expect(response.body.user.email).toBe('admin@example.com');
    });

    it('should return error for non-admin user', async () => {
      const response = await request(app)
        .get('/admin/dashboard')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.error).toBe('Insufficient permissions');
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete user for admin', async () => {
      const response = await request(app)
        .delete(`/users/${regularUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.message).toBe('User deleted successfully');

      // Verify user is deleted
      const deletedUser = await User.findByPk(regularUser.id);
      expect(deletedUser).toBeNull();
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .delete('/users/999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.error).toBe('User not found');
    });

    it('should return error for non-admin user', async () => {
      const response = await request(app)
        .delete(`/users/${regularUser.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.error).toBe('Insufficient permissions');
    });
  });
});
