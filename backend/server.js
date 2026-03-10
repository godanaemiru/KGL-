// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Initialize the Express application
const app = express();

// Middleware to parse JSON and enable CORS
app.use(express.json());
app.use(cors());

// Define the port (defaulting to 5000 if not specified in .env)
const PORT = process.env.PORT || 5000;

// MongoDB Connection String (Replace with your actual MongoDB URI in a .env file)
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/karibu_groceries';

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Basic test route
app.get('/', (req, res) => {
  res.send('Welcome to the Karibu Groceries API!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});