import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Set test environment variables before any other imports
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.TEST_JWT_SECRET || 'test_jwt_secret';
process.env.JWT_REFRESH_SECRET = process.env.TEST_JWT_REFRESH_SECRET || 'test_refresh_secret';

import express from 'express';
import { sequelize } from '../models';
import authRoutes from '../routes/auth';
import adminRoutes from '../routes/admin';
import userRoutes from '../routes/users';
// Import models to ensure they are initialized
import '../models';

export const createTestApp = () => {
  const app = express();
  app.use(express.json());

  // Routes
  app.use('/auth', authRoutes);
  app.use('/admin', adminRoutes);
  app.use('/users', userRoutes);

  return app;
};

export const setupDatabase = async () => {
  await sequelize.sync({ force: true });
};

export const teardownDatabase = async () => {
  await sequelize.close();
};
