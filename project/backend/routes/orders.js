import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Store for real-time notifications (in production, use Redis or Socket.io)
let notificationStore = {
  orders: [],
  users: []
};

// Create order
router.post('/', protect, async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Validate and calculate totals
    let subtotal = 0;
    const validatedItems = [];

    for (let item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        return res.status(400).json({ message: `Product ${item.product} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      const orderItem = {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0]
      };

      validatedItems.push(orderItem);
      subtotal += product.price * item.quantity;
    }

    // No shipping or tax charges
    const shippingCost = 0;
    const tax = 0;
    const totalAmount = subtotal;

    const order = new Order({
      user: req.user._id,
      orderItems: validatedItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      totalAmount
    });

    await order.save();

    // Update product stock
    for (let item of validatedItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Add to notification store for admin
    notificationStore.orders.unshift({
      _id: order._id,
      user: { name: req.user.name, email: req.user.email },
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      isNew: true
    });

    // Keep only last 10 notifications
    if (notificationStore.orders.length > 10) {
      notificationStore.orders = notificationStore.orders.slice(0, 10);
    }

    console.log('New order notification:', {
      type: 'new_order',
      orderId: order._id,
      customerName: req.user.name,
      totalAmount: order.totalAmount,
      timestamp: new Date()
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product', 'name images')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name images');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders (Admin only)
router.get('/', protect, admin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = {};

    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (Admin only)
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { orderStatus, trackingNumber } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    if (orderStatus === 'delivered') {
      order.deliveredAt = Date.now();
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update payment status for COD orders (Admin only)
router.put('/:id/payment-status', protect, admin, async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only allow payment status update for COD orders
    if (order.paymentMethod !== 'cod') {
      return res.status(400).json({ message: 'Payment status can only be updated for Cash on Delivery orders' });
    }

    // Update payment result
    order.paymentResult = {
      ...order.paymentResult,
      status: paymentStatus,
      updatedAt: new Date()
    };

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recent orders for notifications (Admin only)
router.get('/admin/recent', protect, admin, async (req, res) => {
  try {
    // Return from notification store for real-time updates
    const recentOrders = notificationStore.orders.slice(0, 5);
    res.json(recentOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Clear order notifications (Admin only)
router.post('/admin/clear-notifications', protect, admin, async (req, res) => {
  try {
    // Mark all order notifications as read
    notificationStore.orders = notificationStore.orders.map(order => ({
      ...order,
      isNew: false
    }));
    
    res.json({ message: 'Order notifications cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;