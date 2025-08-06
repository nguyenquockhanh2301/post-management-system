// app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

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

// Middlewares
app.use(cors());
app.use(express.json());
app.use(logger);

// === Serve uploaded images from absolute path ===
// compute uploads directory path relative to this file (guaranteed correct)
const uploadsDir = path.join(__dirname, 'uploads');
console.log('Uploads directory resolved to:', uploadsDir);

// Make sure uploads directory exists (optional; helpful for local dev)
if (!fs.existsSync(uploadsDir)) {
  console.log('Uploads directory does not exist, creating:', uploadsDir);
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// IMPORTANT: register static serving BEFORE other routes so it won't be intercepted
app.use('/uploads', express.static(uploadsDir));

// ---------------------- DEBUG ROUTES (temporary) ----------------------
// List files inside uploads folder (for debugging only).
// Remove this endpoint once you finish debugging.
app.get('/debug/uploads', (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error('Error reading uploads dir:', err);
      return res.status(500).json({ error: 'Cannot read uploads directory', details: err.message });
    }
    // Return filenames and file sizes (optional)
    const result = files.map((fname) => {
      try {
        const stat = fs.statSync(path.join(uploadsDir, fname));
        return { name: fname, size: stat.size, mtime: stat.mtime };
      } catch (e) {
        return { name: fname, error: e.message };
      }
    });
    res.json(result);
  });
});
// ---------------------------------------------------------------------

// Mount routes (after static)
app.use('/auth', authRoutes);
app.use('/posts', verifyToken, postRoutes); // keep protected as you had

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
