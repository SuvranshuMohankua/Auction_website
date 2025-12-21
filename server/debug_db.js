const mongoose = require('mongoose');
const User = require('./models/User');
const Bid = require('./models/Bid');
const Auction = require('./models/Auction');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/auction_portal';

async function debug() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({});
        console.log(`\nTotal Users: ${users.length}`);
        users.forEach(u => console.log(`- ${u.username} (${u._id})`));

        const bids = await Bid.find({});
        console.log(`\nTotal Bids: ${bids.length}`);
        bids.forEach(b => console.log(`- Bid by ${b.userId} on ${b.auctionId}: ${b.amount}`));

        const auctions = await Auction.find({});
        console.log(`\nTotal Auctions: ${auctions.length}`);
        auctions.forEach(a => console.log(`- Auction ${a.title} (${a._id}) - Winner: ${a.winner}, Status: ${a.status}`));

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
}

debug();
