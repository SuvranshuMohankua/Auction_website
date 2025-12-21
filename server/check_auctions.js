const mongoose = require('mongoose');
const Auction = require('./models/Auction');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/auction_portal';

async function checkAuctions() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const now = new Date();
        console.log('Current Server Time (UTC):', now.toISOString());
        console.log('Current Server Time (Local):', now.toString());

        const activeAuctions = await Auction.find({ status: 'active' });
        console.log(`\nFound ${activeAuctions.length} active auctions:`);

        activeAuctions.forEach(a => {
            const timeLeft = a.endTime - now;
            console.log(`- "${a.title}"`);
            console.log(`  ID: ${a._id}`);
            console.log(`  Ends: ${a.endTime.toISOString()} (${a.endTime.toString()})`);
            console.log(`  Time left: ${timeLeft / 1000} seconds`);
            console.log(`  Should be closed? ${timeLeft <= 0 ? 'YES' : 'NO'}`);
        });

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
}

checkAuctions();
