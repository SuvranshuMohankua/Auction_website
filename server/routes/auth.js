const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const JWT_EXPIRES_IN = '7d';   // recommended

// Helper: remove password before sending user
const cleanUser = (user) => {
    const obj = user.toObject();
    delete obj.password;
    return obj;
};

// -------------------------
// REGISTER
// -------------------------
router.post('/register', async (req, res) => {
    console.log('Register request received:', req.body);

    try {
        const { username, email, password } = req.body;
        console.log('Destructured body:', { username, email, password });

        if (!username || !email || !password) {
            console.log('Missing fields');
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check duplicates
        console.log('Checking for existing user...');
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });
        console.log('Existing user check result:', existingUser);

        if (existingUser) {
            console.log('User already exists');
            return res.status(400).json({
                error: 'Username or email already exists'
            });
        }

        // Hash password
        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed');

        console.log('Creating user in DB...');
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        console.log('User registered:', user._id);

        const token = jwt.sign(
            { id: user._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(201).json({
            message: 'Registration successful',
            user: cleanUser(user),
            token
        });

    } catch (error) {
        console.error('Registration error details:', error);
        res.status(500).json({ error: 'Registration failed', details: error.message });
    }
});


// -------------------------
// LOGIN
// -------------------------
router.post('/login', async (req, res) => {
    console.log('Login request body:', req.body);

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            console.log('Login failed: No user for email:', email);
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            console.log('Login failed: Wrong password for user:', user._id);
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.json({
            message: 'Login successful',
            user: cleanUser(user),
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});


// -------------------------
// GET CURRENT USER
// -------------------------
// -------------------------
// UPDATE CURRENT USER
// -------------------------
router.put('/me', auth, async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const updates = {};

        if (username) updates.username = username;
        if (email) updates.email = email;
        if (password) {
            updates.password = await bcrypt.hash(password, 10);
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user: cleanUser(user)
        });

    } catch (error) {
        console.error('Update /me error:', error);
        // Handle unique constraint violation (duplicate email/username)
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// -------------------------
// GET CURRENT USER
// -------------------------
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(cleanUser(user));

    } catch (error) {
        console.error('Fetch /me error:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});


module.exports = router;
