const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Add to watchlist
router.post('/watchlist/:auctionId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.watchlist.includes(req.params.auctionId)) {
            user.watchlist.push(req.params.auctionId);
            await user.save();
        }
        res.json(user.watchlist);
    } catch (error) {
        console.error('Error adding to watchlist:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Remove from watchlist
router.delete('/watchlist/:auctionId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.watchlist = user.watchlist.filter(id => id.toString() !== req.params.auctionId);
        await user.save();
        res.json(user.watchlist);
    } catch (error) {
        console.error('Error removing from watchlist:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get watchlist
router.get('/watchlist', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('watchlist');
        res.json(user.watchlist);
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
