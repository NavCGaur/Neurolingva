import express from 'express';
import userController from '../controllers/userController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Route to verify Firebase token
router.get('/', userController.getUser);
router.get('/:id',userController.getUserById)
router.post('/',userController.createUser);
router.put('/:id',userController.editUser);
router.delete('/:id',userController.deleteUser);
router.patch('/update-role', userController.updateUserRole);

// Get current user profile
router.get('/me', authenticateUser, userController.getCurrentUser);

// Get current user subscription
router.get('/subscription', authenticateUser, userController.getSubscription);


export default router;
