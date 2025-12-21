const mongoose = require('mongoose');
const User = require('./models/User');
const Bid = require('./models/Bid');
const Auction = require('./models/Auction');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/auction_portal';

async function debug() {
    try {
        await mongoose.connect(MONGODB_URI);

        const user = await User.findOne({ username: 'suvranshu' });
        if (!user) {
            console.log('User "suvranshu" not found!');
            return;
        }

        console.log(`User: ${user.username}, ID: ${user._id}`);

        const bids = await Bid.find({ userId: user._id });
        console.log(`Found ${bids.length} bids for this user.`);

        bids.forEach(b => console.log(`- Bid ${b.amount} on ${b.auctionId}`));

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
}

debug();
