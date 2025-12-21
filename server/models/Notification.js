const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
    },
    auctionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction',
        required: true
    },
    type: {
        type: String,
        enum: ['auction_won', 'payment_received', 'auction_ended'],
        required: true
    },
    buyerInfo: {
        username: { type: String },
        email: { type: String },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    amount: { type: Number },
    message: { type: String },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
