const express = require('express');
const multer = require('multer');
const Post = require('../models/Post');
const EventEmitter = require('events');

const router = express.Router();
const emitter = new EventEmitter();

// Log event to console
emitter.on('post:created', (post) => {
  console.log(`Event: Post created - ${post.title}`);
});

// Multer setup
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
  fileFilter: (req, file, cb) => {
    const isImage = ['image/png', 'image/jpeg'].includes(file.mimetype);
    cb(null, isImage);
  },
});

// GET /posts
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', category } = req.query;
    const filter = category ? { category } : {};
    const posts = await Post.find(filter)
      .sort({ [sortBy]: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /posts/:id
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /posts (with image)
router.post('/', upload.single('thumbnail'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Thumbnail image is required' });
    }

    const post = new Post({
      ...req.body,
      thumbnail: req.file.path,
      author: req.user.id,
    });

    await post.save();
    emitter.emit('post:created', post);
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /posts/:id
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    Object.assign(post, req.body);
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /posts/:id
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Post.deleteOne({ _id: req.params.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
