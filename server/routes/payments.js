// routes/payments.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Payment = require('../models/Payment');
const Auction = require('../models/Auction');
const Notification = require('../models/Notification');
const User = require('../models/User');

// GET PENDING PAYMENTS (WON AUCTIONS)
// GET PENDING PAYMENTS (WON AUCTIONS)
router.get('/pending', auth, async (req, res) => {
    try {
        const userId = req.userId;

        // Find auctions won by this user
        const wonAuctions = await Auction.find({
            winner: userId,
            status: 'closed'
        }).lean();

        console.log(`[PENDING_PAYMENTS] Found ${wonAuctions.length} won auctions for user ${userId}`);

        // For each won auction, check if payment exists
        const results = await Promise.all(wonAuctions.map(async (auction) => {
            try {
                const payment = await Payment.findOne({ auctionId: auction._id })
                    .sort({ createdAt: -1 })
                    .lean();
                const paymentStatus = payment ? payment.status : 'not_initiated';

                return {
                    ...auction,
                    paymentStatus,
                    paymentId: payment ? payment._id : null
                };
            } catch (err) {
                console.error(`[PENDING_PAYMENTS] Error processing auction ${auction._id}:`, err);
                return {
                    ...auction,
                    paymentStatus: 'error',
                    error: 'Failed to fetch payment status'
                };
            }
        }));

        res.json(results);
    } catch (err) {
        console.error("[PENDING_PAYMENTS] Critical error:", err);
        res.status(500).json({ error: "Failed to fetch pending payments", details: err.message });
    }
});

// INITIATE PAYMENT
router.post('/initiate', auth, async (req, res) => {
    try {
        const { auctionId, buyerDetails } = req.body;

        const auction = await Auction.findById(auctionId);
        if (!auction) return res.status(404).json({ error: 'Auction not found' });

        if (auction.winner.toString() !== req.userId) {
            return res.status(403).json({ error: 'You are not the winner of this auction' });
        }

        if (!auction.seller) {
            return res.status(400).json({ error: 'Auction has no valid seller linked.' });
        }

        const payment = await Payment.create({
            auctionId,
            buyerId: req.userId,
            sellerId: auction.seller,
            amount: auction.currentBid,
            status: 'pending',
            buyerDetails: buyerDetails || {}
        });

        res.json({ payment });

    } catch (err) {
        console.error("Payment init error:", err);
        res.status(500).json({ error: "Payment initiation failed: " + err.message });
    }
});

// COMPLETE PAYMENT
router.post('/complete', auth, async (req, res) => {
    try {
        const { paymentId, buyerDetails } = req.body;

        const payment = await Payment.findById(paymentId);
        if (!payment) return res.status(404).json({ error: 'Payment not found' });

        payment.status = "completed";
        payment.transactionId = "TXN_" + Date.now();
        payment.completedAt = new Date();

        if (buyerDetails) {
            payment.buyerDetails = buyerDetails;
        }

        await payment.save();

        // Buyer details
        const buyer = await User.findById(payment.buyerId);

        // Create seller notification
        await Notification.create({
            sellerId: payment.sellerId,
            auctionId: payment.auctionId,
            type: "payment_received",
            message: `Payment received from ${buyer.username}`,
            buyerInfo: {
                username: buyer.username,
                email: buyer.email,
                userId: buyer._id
            },
            amount: payment.amount
        });

        res.json({ payment });

    } catch (err) {
        console.error("Payment complete error:", err);
        res.status(500).json({ error: "Payment processing failed: " + err.message });
    }
});

module.exports = router;
