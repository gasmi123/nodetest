const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MySQL connection pool
const pool = mysql.createPool({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12774456',
    password: 'xWJYzuc1IL',
    database: 'sql12774456',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Hello Endpoint
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// GET all users
app.get('/users', (req, res) => {
    pool.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// POST login endpoint (✅ only one now)
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const sql = 'SELECT user_id, first_name, last_name, email, phone FROM users WHERE email = ? AND password = ?';
    pool.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({ message: 'Login successful', user: results[0] });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
