const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

function authSeller(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization header missing or malformed' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'seller') {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        req.sellerId = decoded.id;
        next();
    } catch (err) {
        console.error('Seller auth error:', err);
        return res.status(401).json({ error: 'Invalid token' });
    }
}

module.exports = authSeller;
