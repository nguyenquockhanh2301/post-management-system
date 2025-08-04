// app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); // Needed for DB connection
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const logger = require('./middleware/logger');
const verifyToken = require('./middleware/verifyToken');

dotenv.config(); // Load environment variables from .env

const app = express();

// === Connect to MongoDB ===
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// === Middlewares ===
app.use(cors());
app.use(express.json());
app.use(logger); // Logs each request

// === Serve uploaded images ===
app.use('/uploads', express.static('uploads'));

// === Mount Routes ===
app.use('/auth', authRoutes);           // POST /auth/register, /auth/login
app.use('/posts', verifyToken, postRoutes); // Protected CRUD for posts

// === Handle unknown routes ===
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
