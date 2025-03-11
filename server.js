require('dotenv').config();
const express = require('express');
const sequelize = require('./db');  // Import database connection

const app = express();
app.use(express.json());

// Sample route
app.get('/api/users', async (req, res) => {
    const [users] = await sequelize.query('SELECT * FROM users');
    res.json(users);
});

// Start server
app.listen(3000, () => console.log('Server running on port 3000'));
