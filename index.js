// 
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000 || process.env.PORT;

// Middleware
app.use(bodyParser.json());

// MySQL connection setup
const db = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12774456',
    password: 'xWJYzuc1IL',
    database: 'sql12774456'
});

// Connect to DB
db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Login Endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const sql = 'SELECT user_id, first_name, last_name, email, phone FROM users WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error('Error querying the database', err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Return user data
        res.json({ message: 'Login successful', user: results[0] });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
