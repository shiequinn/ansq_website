import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import cors from 'cors';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(cors());
app.use(express.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {rejectUnauthorized: false},
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Serve static files from 'public' folder
app.use(express.static('public'));

// Root route
app.get('/', (req, res) => {
  res.send('Hello from the server!');
});


// get all reviews from the database
app.get('/api/reviews', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM customer_reviews');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

//post a new review to my database
app.post('/api/reviews', async (req, res) => {
  const {name,position, review,rating } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO customer_reviews (name, position, review, rating) VALUES (?, ?, ?, ?)',
      [name, position, review, rating]
    );
    res.status(201).json({ id: result.insertId, name, position, review, rating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});
app.use((_req, res, _next) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
