// controller.js
import * as authService from './services.js';

export const registerUser = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    const user = await authService.registerWithEmailAndPassword(email, password, displayName);
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }
    });
  } catch (error) {
    res.status(400).json({ 
      error: 'Registration failed', 
      message: error.message 
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.signInWithEmailAndPassword(email, password);
    res.json({
      message: 'Login successful',
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      },
      token
    });
  } catch (error) {
    res.status(401).json({ 
      error: 'Login failed', 
      message: error.message 
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await authService.sendPasswordResetEmail(email);
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(400).json({ 
      error: 'Password reset failed', 
      message: error.message 
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await authService.getUserProfile(req.user.uid);
    res.json(user);
  } catch (error) {
    res.status(404).json({ 
      error: 'Profile retrieval failed', 
      message: error.message 
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { displayName, photoURL } = req.body;
    const updatedUser = await authService.updateUserProfile(req.user.uid, { displayName, photoURL });
    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(400).json({ 
      error: 'Profile update failed', 
      message: error.message 
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    await authService.logoutUser(req.user.uid);
    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(400).json({ 
      error: 'Logout failed', 
      message: error.message 
    });
  }
};