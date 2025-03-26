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
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
  
    try {
      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
      db.query(sql, [email, hashedPassword], (err, result) => {
        if (err) {
          console.error("❌ Database Insert Error:", err);
          return res.status(500).json({ error: err.message || 'Failed to register user.' });
        }
        res.status(201).json({ message: 'User registered successfully.', email });
      });
    } catch (error) {
      console.error("❌ Bcrypt Error:", error);
      res.status(500).json({ error: 'Something went wrong during registration.' });
    }
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

        const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return email so frontend can save it for later
        res.json({ message: 'Login successful', token, email });
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
    const { email, title, description } = req.body;

    if (!email || !title || !description) {
        return res.status(400).json({ error: 'Email, title, and description are required.' });
    }

    // Step 1: Fetch user profile details
    const fetchProfileSQL = `SELECT name, profile_image, country, id FROM user_profiles WHERE email = ?`;
    
    db.query(fetchProfileSQL, [email], (err, results) => {
        if (err) {
            console.error('❌ Database Error (Fetching Profile):', err);
            return res.status(500).json({ error: 'Failed to fetch user profile.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'User profile not found.' });
        }

        const { name, profile_image, country, id: user_id } = results[0];

        // Step 2: Insert new post with user profile data
        const insertPostSQL = `
            INSERT INTO posts (title, description, name, profile_image, country, user_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(insertPostSQL, [title, description, name, profile_image, country, user_id], (err, result) => {
            if (err) {
                console.error('❌ Database Error (Inserting Post):', err);
                return res.status(500).json({ error: 'Failed to save post.' });
            }

            res.status(201).json({ message: 'Post added successfully!', postId: result.insertId });
        });
    });
});


app.get('/getPosts', (req, res) => {
    const sql = `
        SELECT p.id, p.title, p.description, up.name, up.profile_image, up.country
        FROM posts p
        JOIN user_profiles up ON p.user_id = up.id
        ORDER BY p.created_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Database Fetch Error:", err);
            return res.status(500).json({ error: 'Failed to fetch posts.' });
        }

        console.log('✅ Data from Database:', results);
        res.json(results);
    });
});


// Endpoint to Save User Data
app.post('/saveUserData', (req, res) => {
    const { user_id, email, country, language, name, gender, profileImage } = req.body;

    console.log('📥 Incoming Data:', req.body);

    if (!user_id || !email || !country || !language || !name || !gender || !profileImage) {
        console.error('❌ Missing fields:', { user_id, email, country, language, name, gender, profileImage });
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = `
        INSERT INTO user_profiles (user_id, email, country, language, name, gender, profile_image)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        country = VALUES(country), 
        language = VALUES(language),
        name = VALUES(name), 
        gender = VALUES(gender), 
        profile_image = VALUES(profile_image)
    `;

    db.query(sql, [
        user_id,
        email,
        country,
        language,
        name,
        gender,
        decodeURIComponent(profileImage)
    ], (err, result) => {
        if (err) {
            console.error('❌ Database Error:', err.message);
            return res.status(500).json({ error: 'Failed to save profile data' });
        }

        console.log('✅ Data saved successfully:', result);
        res.status(200).json({ message: 'Profile data saved successfully' });
    });
});




app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
