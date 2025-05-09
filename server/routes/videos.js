
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Video = require('../models/Video');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const mongoose = require('mongoose');

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, process.env.UPLOAD_DIR || './uploads');
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to accept only video files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /mp4|mov|avi/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only video files (MP4, MOV, AVI) are allowed!'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// GET all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET search videos by query
router.get('/search', async (req, res) => {
  try {
    const { q, tag, movie } = req.query;
    let query = {};

    if (q) {
      query = { $text: { $search: q } };
    } else if (tag) {
      query = { tags: tag };
    } else if (movie) {
      query = { movieName: { $regex: movie, $options: 'i' } };
    }

    const videos = await Video.find(query).sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific video
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    // Check if ID is valid before querying
    if (!id || id === 'undefined' || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Invalid video ID' });
    }
    
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST upload a new video
router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a video file' });
    }

    const { title, movieName, tags } = req.body;
    
    if (!title || !tags) {
      // Delete the uploaded file if data is invalid
      await unlinkAsync(req.file.path);
      return res.status(400).json({ message: 'Title and tags are required' });
    }

    // Process tags (convert string to array if needed)
    let parsedTags = tags;
    if (typeof tags === 'string') {
      parsedTags = tags.split(',').map(tag => tag.trim());
    }

    // The video path to serve to clients
    const videoPath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    // Create new video document
    const video = new Video({
      title,
      movieName: movieName || 'Unknown',
      filePath: videoPath,
      thumbnailPath: '', // Client-side thumbnail generation
      tags: parsedTags,
      userId: req.body.userId || 'anonymous'
    });

    const savedVideo = await video.save();
    res.status(201).json(savedVideo);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE a video
router.delete('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Extract the filename from the filePath
    const filePath = video.filePath;
    const fileName = filePath.split('/').pop();
    const fullPath = path.join(process.env.UPLOAD_DIR || './uploads', fileName);

    // Delete file from filesystem
    try {
      await unlinkAsync(fullPath);
    } catch (err) {
      console.error('File deletion error:', err);
      // Continue even if file deletion fails
    }

    // Remove from database
    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: 'Video deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
