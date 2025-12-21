const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Seller = require('../models/Seller');
const authSeller = require('../middleware/authSeller');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Register a new seller
router.post('/register', async (req, res) => {
    const { sellername, email, password } = req.body;
    if (!sellername || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const existing = await Seller.findOne({ email });
        if (existing) {
            return res.status(400).json({ error: 'Email already in use' });
        }
        const seller = new Seller({ sellername, email, password });
        await seller.save();
        const token = jwt.sign({ id: seller._id, role: 'seller' }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, seller: { id: seller._id, sellername, email } });
    } catch (err) {
        console.error('Seller registration error:', err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login seller
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }
    try {
        const seller = await Seller.findOne({ email });
        if (!seller) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, seller.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: seller._id, role: 'seller' }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, seller: { id: seller._id, sellername: seller.sellername, email: seller.email } });
    } catch (err) {
        console.error('Seller login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get current seller profile (protected)
router.get('/me', authSeller, async (req, res) => {
    try {
        const seller = await Seller.findById(req.sellerId).select('-password');
        if (!seller) return res.status(404).json({ error: 'Seller not found' });
        res.json({ seller });
    } catch (err) {
        console.error('Seller profile error:', err);
        res.status(500).json({ error: 'Failed to fetch seller' });
    }
});

// Update seller profile (protected)
router.put('/profile', authSeller, async (req, res) => {
    const { sellername, email, password } = req.body;
    try {
        const seller = await Seller.findById(req.sellerId);
        if (!seller) {
            return res.status(404).json({ error: 'Seller not found' });
        }

        // Check if email is being changed and if it's already taken
        if (email && email !== seller.email) {
            const existingEmail = await Seller.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ error: 'Email already in use' });
            }
            seller.email = email;
        }

        if (sellername) seller.sellername = sellername;
        if (password) seller.password = password; // Will be hashed by pre-save hook

        await seller.save();

        res.json({
            message: 'Profile updated successfully',
            seller: {
                id: seller._id,
                sellername: seller.sellername,
                email: seller.email
            }
        });
    } catch (err) {
        console.error('Seller profile update error:', err);
        res.status(500).json({ error: 'Profile update failed' });
    }
});

module.exports = router;
