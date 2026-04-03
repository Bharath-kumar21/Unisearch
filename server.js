const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

const University = require('./models/University'); // Import the Mongoose model
const User = require('./models/User'); // Import the new User model

const app = express();
const PORT = 5000;
const SECRET_KEY = 'your_super_secret_key_change_in_production'; // Keep it simple for local dev

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/university_platform';
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB via server.js'))
    .catch((err) => console.error('Failed to connect to MongoDB:', err));

app.use(cors());
app.use(express.json());

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Authentication required' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });
        req.user = user;
        next();
    });
};

// --- ROUTES ---

// Signup
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user exists in DB
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email: email.toLowerCase(),
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        // Generate token using MongoDB _id
        const token = jwt.sign({ id: savedUser._id, email: savedUser.email }, SECRET_KEY, { expiresIn: '24h' });

        // Don't send password back
        const userWithoutPassword = savedUser.toObject();
        delete userWithoutPassword.password;

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user in DB
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });

        // Don't send password back
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        res.json({
            message: 'Logged in successfully',
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Profile
app.get('/api/users/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password from the query directly

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error("Profile fetch error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --- UNIVERSITY ROUTES (MongoDB) ---

// Get all universities
app.get('/api/universities', async (req, res) => {
    try {
        const universities = await University.find({}).sort({ ranking: 1 });
        res.json(universities);
    } catch (error) {
        console.error("Error fetching universities:", error);
        res.status(500).json({ message: 'Server error fetching universities' });
    }
});

// Get single university by ID
app.get('/api/universities/:id', async (req, res) => {
    try {
        const university = await University.findById(req.params.id);
        if (!university) {
            return res.status(404).json({ message: 'University not found' });
        }
        res.json(university);
    } catch (error) {
        console.error("Error fetching university details:", error);
        res.status(500).json({ message: 'Server error fetching university' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
