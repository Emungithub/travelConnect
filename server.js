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
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
      db.query(sql, [email, hashedPassword], (err, result) => {
        if (err) {
          console.error("❌ Database Insert Error:", err);
          return res.status(500).json({ error: err.message || 'Failed to register user.' });
        }
  
        console.log('✅ User inserted with ID:', result.insertId);
        res.status(201).json({
          message: 'User registered successfully.',
          email,
          id: result.insertId, // ✅ Include user ID in response
        });
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
        console.log('✅ test:', user);
        // Return email so frontend can save it for later
        res.json({ message: 'Login successful', token, email, id: user.id });
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
    const { user_id, title, description } = req.body;

    if (!user_id || !title || !description) {
        return res.status(400).json({ error: 'User ID, title, and description are required.' });
    }

    const insertPostSQL = `
        INSERT INTO posts (title, description, user_id)
        VALUES (?, ?, ?)
    `;

    db.query(insertPostSQL, [title, description, user_id], (err, result) => {

        if (err) {
            console.error('❌ Error inserting post:', err);
            return res.status(500).json({ error: 'Failed to save post.' });
        }

        res.status(201).json({ message: 'Post added successfully!', postId: result.insertId });
    });
});



app.get('/getPosts', (req, res) => {
    const sql = `
        SELECT p.id, p.title, p.description, u.name, u.profile_image, u.country
        FROM posts p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching posts:", err);
            return res.status(500).json({ error: "Failed to fetch posts." });
        }
        console.log("✅ Posts fetched:", results);
        res.json(results);
    });
});

app.get('/getQuestions', (req, res) => {
    const sql = `
      SELECT p.id, p.title, p.description, u.name, u.profile_image, u.country
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `;
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error("❌ Error fetching questions:", err);
        return res.status(500).json({ error: "Failed to fetch questions." });
      }
  
      console.log("✅ Questions fetched:", results);
      res.json(results); // ✅ should return JSON
    });
  });
  


// Endpoint to Save User Data
app.post('/saveUserData', (req, res) => {
    const { email, country, language, name, gender, profileImage } = req.body;

    console.log('📥 Incoming Data:', req.body);

    if (!email || !country || !language || !name || !gender || !profileImage) {
        console.error('❌ Missing fields:', { email, country, language, name, gender, profileImage });
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = `
        UPDATE users 
        SET country = ?, 
            language = ?, 
            name = ?, 
            gender = ?, 
            profile_image = ?
        WHERE email = ?;
    `;

    db.query(sql, [
        country,
        language,
        name,
        gender,
        decodeURIComponent(profileImage),
        email
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
