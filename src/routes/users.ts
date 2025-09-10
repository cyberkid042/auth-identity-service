import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';

const router = Router();

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(authorizeRoles('admin'));

// Admin-only: list all users
router.get('/', getUsers);

// Admin-only: CRUD operations on specific user by ID
router.get('/:id', getUserById);
router.put('/:id', updateUserById);
router.delete('/:id', deleteUserById);

export default router;
