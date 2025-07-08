import express from 'express';
import ContactApplication from '../models/ContactApplication.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Store for real-time notifications (in production, use Redis or Socket.io)
let contactNotificationStore = [];

// Submit contact form
router.post('/submit', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const contactApplication = new ContactApplication({
      name,
      email,
      subject,
      message
    });

    await contactApplication.save();

    // Add to notification store for admin
    contactNotificationStore.unshift({
      _id: contactApplication._id,
      name: contactApplication.name,
      email: contactApplication.email,
      subject: contactApplication.subject,
      createdAt: contactApplication.createdAt,
      isNew: true
    });

    // Keep only last 10 notifications
    if (contactNotificationStore.length > 10) {
      contactNotificationStore = contactNotificationStore.slice(0, 10);
    }

    console.log('New contact application:', {
      type: 'new_contact',
      applicationId: contactApplication._id,
      name: contactApplication.name,
      email: contactApplication.email,
      subject: contactApplication.subject,
      timestamp: new Date()
    });

    res.status(201).json({ 
      message: 'Your message has been sent successfully! We will get back to you soon.',
      application: contactApplication
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({ message: 'Failed to submit contact form' });
  }
});

// Get all contact applications (Admin only)
router.get('/applications', protect, admin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    const applications = await ContactApplication.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ContactApplication.countDocuments(query);

    res.json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single contact application (Admin only)
router.get('/applications/:id', protect, admin, async (req, res) => {
  try {
    const application = await ContactApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Mark as read
    if (application.status === 'new') {
      application.status = 'read';
      application.isNew = false;
      await application.save();
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update contact application status (Admin only)
router.put('/applications/:id', protect, admin, async (req, res) => {
  try {
    const { status, priority, adminNotes } = req.body;

    const application = await ContactApplication.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        priority, 
        adminNotes,
        isNew: false
      },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete contact application (Admin only)
router.delete('/applications/:id', protect, admin, async (req, res) => {
  try {
    const application = await ContactApplication.findByIdAndDelete(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recent contact applications for notifications (Admin only)
router.get('/admin/recent', protect, admin, async (req, res) => {
  try {
    // Return from notification store for real-time updates
    const recentApplications = contactNotificationStore.slice(0, 5);
    res.json(recentApplications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Clear contact notifications (Admin only)
router.post('/admin/clear-notifications', protect, admin, async (req, res) => {
  try {
    // Mark all contact notifications as read
    contactNotificationStore = contactNotificationStore.map(app => ({
      ...app,
      isNew: false
    }));
    
    res.json({ message: 'Contact notifications cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get contact statistics (Admin only)
router.get('/admin/stats', protect, admin, async (req, res) => {
  try {
    const totalApplications = await ContactApplication.countDocuments();
    const newApplications = await ContactApplication.countDocuments({ status: 'new' });
    const resolvedApplications = await ContactApplication.countDocuments({ status: 'resolved' });
    const highPriorityApplications = await ContactApplication.countDocuments({ priority: 'high' });

    res.json({
      totalApplications,
      newApplications,
      resolvedApplications,
      highPriorityApplications
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add contact application to notification store (called when new application is created)
export const addContactNotification = (application) => {
  contactNotificationStore.unshift({
    _id: application._id,
    name: application.name,
    email: application.email,
    subject: application.subject,
    createdAt: application.createdAt,
    isNew: true
  });

  // Keep only last 10 notifications
  if (contactNotificationStore.length > 10) {
    contactNotificationStore = contactNotificationStore.slice(0, 10);
  }

  console.log('New contact application notification:', {
    type: 'new_contact',
    applicationId: application._id,
    name: application.name,
    email: application.email,
    subject: application.subject,
    timestamp: new Date()
  });
};

export default router;