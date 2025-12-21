const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    startingBid: { type: Number, required: true },
    currentBid: { type: Number, required: true },
    endTime: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['active', 'closed'], default: 'active' }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for bid history
auctionSchema.virtual('bids', {
    ref: 'Bid',
    localField: '_id',
    foreignField: 'auctionId'
});

module.exports = mongoose.model('Auction', auctionSchema);
