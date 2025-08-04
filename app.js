// app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const logger = require('./middleware/logger');
const verifyToken = require('./middleware/verifyToken');

dotenv.config();

const app = express();

// === Connect to MongoDB ===
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// === Middlewares ===
app.use(cors());
app.use(express.json());                    // Parse JSON body
app.use(logger);                            // Custom request logger
app.use('/uploads', express.static('uploads')); // Serve image files

// === Routes ===
app.use('/auth', authRoutes);               // Public routes
app.use('/posts', verifyToken, postRoutes); // Protected routes

// === Handle unknown routes ===
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
