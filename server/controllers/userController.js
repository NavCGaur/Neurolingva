import mongoose from 'mongoose';

import userService from '../services/user/index.js';

import { UserSchema } from '../models/userSchema.js'; 

const User = mongoose.model('User', UserSchema);

const userController = {
  /**
   * Get all users
   */
  getUser: async (req, res) => {
    try {
      const { userId, page = 1, pageSize = 20, sort = null, search = "" } = req.query;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const requestingUser = await User.findOne({ uid: userId }).select("role");
      
      if (!requestingUser) {
        return res.status(404).json({ message: "Requesting user not found" });
      }
      
      const role = requestingUser.role;
      console.log("Role in controller of user:", role);

      // Call the service layer
      const { users, total } = await userService.getUser({
        role,
        page: Number(page),
        pageSize: Number(pageSize),
        sort,
        search: search.trim()
      });
  
      if (!users.length) {
        return res.status(200).json({ 
          message: "No users found", 
          users: [], 
          total 
        });
      }
  
      res.status(200).json({ users, total });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * Get user by ID
   */
  getUserById: async (req, res) => {
    try {
      const user = await userService.getUserById(req.params.id);
      return res.status(200).json({ success: true, data: user, message: 'User fetched successfully' });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  /**
   * Create a new user
   */
  createUser: async (req, res) => {
    try {
      const newUser = await userService.createUser(req.body);
      return res.status(201).json({ success: true, data: newUser, message: 'User created successfully' });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  /**
   * Edit user details
   */
  editUser: async (req, res) => {
    try {
      const updatedUser = await userService.editUser(req.params.id, req.body);
      return res.status(200).json({ success: true, data: updatedUser, message: 'User updated successfully' });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  updateUserRole: async (req, res) => {
    try {
      console.log("Updating user role...");
      const { email, parentId, role } = req.body;
      const result = await updateUserRoleService(email, parentId, role);
      res.status(200).json({ message: 'User role updated', data: result });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  /**
   * Delete a user by ID
   */
  deleteUser: async (req, res) => {
    try {
      const deletedUser = await userService.deleteUser(req.params.id);
      return res.status(200).json({ success: true, data: deletedUser, message: 'User deleted successfully' });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  getCurrentUser: async (req, res) => {
    try {
      const { userId } = req.user;
      
      const user = await User.findOne({ uid: userId });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.status(200).json({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: user.role,
        createdAt: user.createdAt
      });
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  getSubscription: async (req, res) => {

    try {
      const { userId } = req.user;
      
      const user = await User.findOne({ uid: userId });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.status(200).json({
        planId: user.planId || 'free',
        subscriptionStatus: user.subscriptionStatus,
        stripeCustomerId: user.stripeCustomerId,
        stripeSubscriptionId: user.stripeSubscriptionId,
        currentPeriodEnd: user.currentPeriodEnd,
        cancelAtPeriodEnd: user.cancelAtPeriodEnd || false
      });
    } catch (error) {
      console.error('Error getting subscription:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
};

export default userController;
