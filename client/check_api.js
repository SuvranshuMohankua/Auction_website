const axios = require('axios');

async function checkApi() {
    try {
        console.log('Fetching from API...');
        const res = await axios.get('http://localhost:3001/api/auctions');
        const auctions = res.data;
        console.log(`API returned ${auctions.length} auctions.`);

        const testAuctions = auctions.filter(a => a.title.includes('Deterministic Test Auction'));
        console.log(`Found ${testAuctions.length} Deterministic Test Auctions in API response:`);

        testAuctions.forEach(a => {
            console.log(`- [${a.status}] ${a.title}`);
            console.log(`  Ends: ${a.endTime}`);
        });

    } catch (error) {
        console.error('API Error:', error.message);
    }
}

checkApi();
