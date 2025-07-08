import express from 'express';
import User from '../models/User.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Store for real-time notifications (in production, use Redis or Socket.io)
let userNotificationStore = [];

// Get all users (Admin only)
router.get('/', protect, admin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const users = await User.find({ role: 'user' })
      .select('-password -otp')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments({ role: 'user' });

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by ID (Admin only)
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -otp');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Block/Unblock user (Admin only)
router.put('/:id/toggle-status', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot modify admin user' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user stats (Admin only)
router.get('/stats/overview', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ role: 'user', isActive: true });
    const newUsersThisMonth = await User.countDocuments({
      role: 'user',
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    });

    res.json({
      totalUsers,
      activeUsers,
      blockedUsers: totalUsers - activeUsers,
      newUsersThisMonth
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recent users for notifications (Admin only)
router.get('/admin/recent', protect, admin, async (req, res) => {
  try {
    // Return from notification store for real-time updates
    const recentUsers = userNotificationStore.slice(0, 5);
    res.json(recentUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Clear user notifications (Admin only)
router.post('/admin/clear-notifications', protect, admin, async (req, res) => {
  try {
    // Mark all user notifications as read
    userNotificationStore = userNotificationStore.map(user => ({
      ...user,
      isNew: false
    }));
    
    res.json({ message: 'User notifications cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add user to notification store (called when new user registers)
export const addUserNotification = (user) => {
  userNotificationStore.unshift({
    _id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    isNew: true
  });

  // Keep only last 10 notifications
  if (userNotificationStore.length > 10) {
    userNotificationStore = userNotificationStore.slice(0, 10);
  }

  console.log('New user notification:', {
    type: 'new_user',
    userId: user._id,
    userName: user.name,
    userEmail: user.email,
    timestamp: new Date()
  });
};

export default router;