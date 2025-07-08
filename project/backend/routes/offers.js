import express from 'express';
import Offer from '../models/Offer.js';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Get active offers
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const offers = await Offer.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).populate('products', 'name price images');

    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all offers (Admin only)
router.get('/admin', protect, admin, async (req, res) => {
  try {
    const offers = await Offer.find()
      .populate('products', 'name price')
      .sort({ createdAt: -1 });

    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create offer (Admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const offer = new Offer(req.body);
    await offer.save();
    
    // Update product prices if needed
    if (offer.products && offer.products.length > 0) {
      for (let productId of offer.products) {
        const product = await Product.findById(productId);
        if (product) {
          if (!product.originalPrice) {
            product.originalPrice = product.price;
          }

          let discountAmount = 0;
          if (offer.discountType === 'percentage') {
            discountAmount = (product.originalPrice * offer.discountValue) / 100;
          } else {
            discountAmount = offer.discountValue;
          }

          if (offer.maxDiscountAmount) {
            discountAmount = Math.min(discountAmount, offer.maxDiscountAmount);
          }

          product.price = product.originalPrice - discountAmount;
          await product.save();
        }
      }
    }

    res.status(201).json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update offer (Admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete offer (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    // Restore original prices
    if (offer.products && offer.products.length > 0) {
      for (let productId of offer.products) {
        const product = await Product.findById(productId);
        if (product && product.originalPrice) {
          product.price = product.originalPrice;
          product.originalPrice = undefined;
          await product.save();
        }
      }
    }

    await Offer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Offer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;