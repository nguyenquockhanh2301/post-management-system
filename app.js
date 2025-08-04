// File: app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const logger = require('./middleware/logger');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);
app.use('/uploads', express.static('uploads'));

// ✅ Public route
app.use('/auth', authRoutes);

// ✅ Public GET routes for posts
app.use('/posts', postRoutes);

module.exports = app;
