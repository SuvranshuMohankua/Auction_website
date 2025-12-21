const express = require('express');
const router = express.Router();
const Bid = require('../models/Bid');
const Auction = require('../models/Auction');
const authMiddleware = require('../middleware/auth');
const { closeExpiredAuctions } = require('../utils/auctionUtils');
const mongoose = require('mongoose');

// GET /api/bids/my-bids
router.get("/my-bids", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        console.log(`[MY_BIDS] Request for user: ${userId}`);

        // Auto-close expired auctions before fetching bids
        await closeExpiredAuctions(req.io);

        // Fetch the user's bids
        const userBids = await Bid.find({ userId })
            .populate("auctionId")
            .sort({ timestamp: -1 });

        console.log(`[MY_BIDS] Found ${userBids.length} bids in database`);

        const unique = {};

        for (const b of userBids) {
            const auction = b.auctionId;

            if (!auction) {
                console.log(`[MY_BIDS] Bid ${b._id} has missing auction reference`);
                continue;
            }

            const auctionId = String(auction._id);

            // Determine if auction is ended
            const now = new Date();
            const isEnded = auction.status === "closed" || new Date(auction.endTime) < now;

            // Determine if user is the winner
            const isWinning =
                isEnded &&
                auction.winner &&
                String(auction.winner) === String(userId);

            if (!unique[auctionId]) {
                unique[auctionId] = {
                    auction,
                    highestUserBid: b.amount,
                    lastBidTime: b.timestamp,
                    isEnded,
                    isWinning
                };
            } else {
                // Update the user's highest bid
                if (b.amount > unique[auctionId].highestUserBid) {
                    unique[auctionId].highestUserBid = b.amount;
                    unique[auctionId].lastBidTime = b.timestamp;
                }
            }
        }

        const result = Object.values(unique);
        console.log(`[MY_BIDS] Returning ${result.length} auctions`);

        res.json(result);

    } catch (err) {
        console.error("Fetch bids error:", err);
        res.status(500).json({ error: "Failed to fetch user bids" });
    }
});

module.exports = router;
