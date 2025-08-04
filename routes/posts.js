// File: routes/posts.js
const express = require('express');
const multer = require('multer');
const Post = require('../models/Post');
const verifyToken = require('../middleware/verifyToken');
const EventEmitter = require('events');

const router = express.Router();
const emitter = new EventEmitter();

// Log post creation event
emitter.on('post:created', (post) => {
  console.log(`Event: Post created - ${post.title}`);
});

// Multer config
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // limit to 2MB
  fileFilter: (req, file, cb) => {
    const isImage = ['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype);
    cb(null, isImage);
  }
});

// ✅ Public: Get all posts
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, sortBy = 'createdAt', category } = req.query;
  const filter = category ? { category } : {};
  const posts = await Post.find(filter)
    .sort({ [sortBy]: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json(posts);
});

// ✅ Public: Get post by ID
router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.json(post);
});

// ✅ Protected: Create post
router.post('/', verifyToken, upload.single('thumbnail'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Thumbnail image is required' });

  const post = new Post({
    ...req.body,
    thumbnail: req.file.path,
    author: req.user.id
  });
  await post.save();
  emitter.emit('post:created', post);
  res.status(201).json(post);
});

// ✅ Protected: Update post
router.put('/:id', verifyToken, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post || post.author.toString() !== req.user.id)
    return res.status(403).json({ message: 'Unauthorized' });

  Object.assign(post, req.body);
  await post.save();
  res.json(post);
});

// ✅ Protected: Delete post
router.delete('/:id', verifyToken, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post || post.author.toString() !== req.user.id)
    return res.status(403).json({ message: 'Unauthorized' });

  await post.deleteOne();   // ✅ FIXED: replace deprecated remove() with deleteOne()
  res.json({ message: 'Deleted' });
});

module.exports = router;
