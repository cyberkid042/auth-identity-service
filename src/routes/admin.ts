import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';

const router = Router();

// Apply authentication and role authorization middleware
router.use(authenticateToken);
router.use(authorizeRoles('admin'));

router.get('/dashboard', (req, res) => {
  res.json({
    message: 'Welcome to the admin dashboard',
    user: req.user,
  });
});

export default router;
