import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendOTP, sendPasswordResetOTP, testEmailConfiguration } from '../utils/sendEmail.js';
import { protect } from '../middleware/auth.js';
import { addUserNotification } from './users.js';

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Temporary OTP storage (in production, use Redis or database)
const otpStorage = new Map();

// Send OTP for registration
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if email service is configured
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return res.status(500).json({ 
        message: 'Email service not configured. Please contact administrator.',
        error: 'GMAIL_USER and GMAIL_APP_PASSWORD not set in environment variables'
      });
    }

    // Check if user already exists and is verified
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isEmailVerified) {
      return res.status(400).json({ message: 'Email already registered and verified' });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    try {
      // Send OTP
      await sendOTP(email, otp);
      
      // Store OTP in memory (in production, use Redis or database)
      otpStorage.set(email, {
        otp: otp,
        expiry: otpExpiry,
        attempts: 0,
        type: 'registration'
      });

      // If user exists but not verified, update OTP
      if (existingUser && !existingUser.isEmailVerified) {
        existingUser.otp = { code: otp, expiry: otpExpiry };
        await existingUser.save();
      }

      res.json({ 
        message: 'OTP sent successfully to your email',
        email: email,
        otp_expiry: '10 minutes',
        from_email: process.env.GMAIL_USER
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      return res.status(500).json({ 
        message: 'Failed to send OTP. Please check your email configuration.',
        error: emailError.message
      });
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ 
      message: 'Server error while sending OTP',
      error: error.message 
    });
  }
});

// Send OTP for password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email, isEmailVerified: true });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email address' });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    try {
      // Send password reset OTP
      await sendPasswordResetOTP(email, otp, user.name);
      
      // Store OTP in memory
      otpStorage.set(email, {
        otp: otp,
        expiry: otpExpiry,
        attempts: 0,
        type: 'password_reset'
      });

      res.json({ 
        message: 'Password reset OTP sent to your email',
        email: email
      });
    } catch (emailError) {
      console.error('Password reset email error:', emailError);
      return res.status(500).json({ 
        message: 'Failed to send password reset OTP',
        error: emailError.message
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Reset password with OTP
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check OTP from memory storage
    const storedOtpData = otpStorage.get(email);
    if (!storedOtpData || storedOtpData.type !== 'password_reset') {
      return res.status(400).json({ message: 'OTP expired or not found. Please request a new password reset.' });
    }

    if (storedOtpData.otp !== otp || storedOtpData.expiry < Date.now()) {
      storedOtpData.attempts += 1;
      if (storedOtpData.attempts >= 3) {
        otpStorage.delete(email);
        return res.status(400).json({ message: 'Too many failed attempts. Please request a new password reset.' });
      }
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Find user and check if new password is same as old password
    const user = await User.findOne({ email, isEmailVerified: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if new password is same as current password
    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      return res.status(400).json({ 
        message: 'New password cannot be the same as your current password. Please choose a different password.' 
      });
    }

    user.password = newPassword;
    await user.save();

    // Clear OTP from memory
    otpStorage.delete(email);

    res.json({ message: 'Password reset successfully. You can now login with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Verify OTP and Register
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, name, password, phone, address } = req.body;

    if (!email || !otp || !name || !password) {
      return res.status(400).json({ message: 'Email, OTP, name, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check OTP from memory storage
    const storedOtpData = otpStorage.get(email);
    if (!storedOtpData || storedOtpData.type !== 'registration') {
      return res.status(400).json({ message: 'OTP expired or not found. Please request a new OTP.' });
    }

    if (storedOtpData.otp !== otp || storedOtpData.expiry < Date.now()) {
      // Increment attempts
      storedOtpData.attempts += 1;
      if (storedOtpData.attempts >= 3) {
        otpStorage.delete(email);
        return res.status(400).json({ message: 'Too many failed attempts. Please request a new OTP.' });
      }
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user && user.isEmailVerified) {
      return res.status(400).json({ message: 'User already exists and is verified' });
    }

    if (user) {
      // Update existing user
      user.name = name;
      user.password = password;
      user.phone = phone || '';
      user.address = address || {};
      user.isEmailVerified = true;
      user.isActive = true;
      user.otp = undefined;
      await user.save();
    } else {
      // Create new user
      user = new User({
        name,
        email,
        password,
        phone: phone || '',
        address: address || {},
        isEmailVerified: true,
        isActive: true
      });
      await user.save();
    }

    // Add user notification for admin
    addUserNotification(user);

    // Clear OTP from memory
    otpStorage.delete(email);

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isEmailVerified) {
      return res.status(401).json({ message: 'Please verify your email first' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated. Please contact support.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get Profile
router.get('/profile', protect, async (req, res) => {
  try {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
      address: req.user.address,
      isEmailVerified: req.user.isEmailVerified
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update Profile
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }
      
      // Check if new password is same as current password
      const isSamePassword = await user.comparePassword(req.body.password);
      if (isSamePassword) {
        return res.status(400).json({ 
          message: 'New password cannot be the same as your current password. Please choose a different password.' 
        });
      }
      
      user.password = req.body.password;
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Test email configuration
router.get('/test-email', async (req, res) => {
  try {
    const result = await testEmailConfiguration();
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error during email test', 
      error: error.message 
    });
  }
});

export default router;