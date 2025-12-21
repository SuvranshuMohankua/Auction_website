const express = require('express');
const router = express.Router();
const authSeller = require('../middleware/authSeller');
const Notification = require('../models/Notification');

// Get all notifications for seller
router.get('/', authSeller, async (req, res) => {
    try {
        const notifications = await Notification.find({ sellerId: req.sellerId })
            .populate('auctionId', 'title imageUrl currentBid')
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// Get unread notification count
router.get('/unread-count', authSeller, async (req, res) => {
    try {
        const count = await Notification.countDocuments({
            sellerId: req.sellerId,
            read: false
        });
        res.json({ count });
    } catch (error) {
        console.error('Error counting notifications:', error);
        res.status(500).json({ error: 'Failed to count notifications' });
    }
});

// Mark notification as read
router.put('/:id/read', authSeller, async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, sellerId: req.sellerId },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.json(notification);
    } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).json({ error: 'Failed to update notification' });
    }
});

// Mark all notifications as read
router.put('/mark-all-read', authSeller, async (req, res) => {
    try {
        await Notification.updateMany(
            { sellerId: req.sellerId, read: false },
            { read: true }
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Error marking all read:', error);
        res.status(500).json({ error: 'Failed to mark all as read' });
    }
});

module.exports = router;
