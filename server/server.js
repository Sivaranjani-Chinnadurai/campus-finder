const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
// It will try to connect to a local MongoDB instance by default
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lostandfound';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const postsRouter = require('./routes/posts');
app.use('/api/posts', postsRouter);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
