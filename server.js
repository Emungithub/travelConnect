require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'travelConnectDB',
    port: process.env.DB_PORT || 3306
});

// Attempt connection
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        return;
    }
    console.log('Connected to MySQL database.');
});

// ==============================
// Register Endpoint
// ==============================
app.post('/register', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(sql, [email, password], (err, result) => {
        if (err) {
            console.error("Database Insert Error:", err);
            return res.status(500).json({ error: 'Failed to register user.' });
        }
        res.status(201).json({ message: 'User registered successfully.' });
    });
});


// ==============================
// Login Endpoint
// ==============================
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const sql = `SELECT * FROM users WHERE email = ?`;
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Login failed' });

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT Token for session
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    });
});

// ==============================
// Protected Route (For Testing)
// ==============================
app.get('/profile', authenticateToken, (req, res) => {
    res.json({ message: 'Welcome to your profile!' });
});

// ==============================
// Token Authentication Middleware
// ==============================
function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
}

// ==============================
// Add Post Endpoint
// ==============================
app.post('/addPost', (req, res) => {
    const { title, description } = req.body;

    console.log('📥 Incoming Data:', req.body);  // ✅ Log received data

    if (!title || !description) {  // ✅ Location removed from condition
        return res.status(400).json({ error: 'Title and description are required.' });
    }

    const sql = `INSERT INTO posts (title, description) VALUES (?, ?)`;

    db.query(sql, [title, description], (err, result) => {
        if (err) {
            console.error("❌ Database Insert Error:", err);  // ✅ Log database errors
            return res.status(500).json({ error: 'Failed to save post.' });
        }
        res.status(201).json({ message: 'Post added successfully!', postId: result.insertId });
    });
});

app.get('/getPosts', (req, res) => {
    const sql = `SELECT id, title, description FROM posts ORDER BY created_at DESC`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Database Fetch Error:", err);
            return res.status(500).json({ error: 'Failed to fetch posts.' });
        }
        res.json(results); // Return all posts
    });
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
