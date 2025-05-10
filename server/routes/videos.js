
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Video = require('../models/Video');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const mongoose = require('mongoose');
const { createThumbnail } = require('../utils/videoProcessor');

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
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

    // Get host from request for constructing absolute URLs
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    
    // The video path to serve to clients
    const videoPath = `${baseUrl}/uploads/${req.file.filename}`;
    
    // Generate thumbnail
    let thumbnailPath = '';
    
    try {
      // Use the utility function to create thumbnail
      const thumbnailResult = await createThumbnail(
        req.file.path,
        uploadDir,
        req.file.filename
      );
      
      if (thumbnailResult) {
        // Get just the filename part from the result
        const thumbnailFilename = path.basename(thumbnailResult);
        thumbnailPath = `${baseUrl}/uploads/thumbnails/${thumbnailFilename}`;
      }
    } catch (thumbErr) {
      console.error('Thumbnail generation error:', thumbErr);
      // Continue without thumbnail if generation fails
      thumbnailPath = '';
    }

    // Create new video document
    const video = new Video({
      title,
      movieName: movieName || 'Unknown',
      filePath: videoPath,
      thumbnailPath,
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

// POST upload multiple videos
router.post('/upload/batch', upload.array('videos', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Please upload at least one video file' });
    }

    const { movieName, tags: tagsString } = req.body;
    
    if (!tagsString) {
      // Delete the uploaded files if data is invalid
      for (const file of req.files) {
        await unlinkAsync(file.path);
      }
      return res.status(400).json({ message: 'Tags are required for batch upload' });
    }

    // Process tags (convert string to array if needed)
    let parsedTags = tagsString;
    if (typeof tagsString === 'string') {
      parsedTags = tagsString.split(',').map(tag => tag.trim());
    }

    // Process each uploaded file
    const uploadedVideos = [];
    const errors = [];
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const uploadDir = process.env.UPLOAD_DIR || './uploads';

    for (const file of req.files) {
      try {
        // Generate title if not provided individually
        const title = `${movieName || 'Movie'} meme ${uploadedVideos.length + 1}`;
        
        // The video path to serve to clients
        const videoPath = `${baseUrl}/uploads/${file.filename}`;
        
        // Generate thumbnail for each video
        let thumbnailPath = '';
        try {
          // Use the utility function to create thumbnail
          const thumbnailResult = await createThumbnail(
            file.path, 
            uploadDir, 
            file.filename
          );
          
          if (thumbnailResult) {
            // Get just the filename part from the result
            const thumbnailFilename = path.basename(thumbnailResult);
            thumbnailPath = `${baseUrl}/uploads/thumbnails/${thumbnailFilename}`;
          }
        } catch (thumbErr) {
          console.error('Thumbnail generation error for batch file:', thumbErr);
          // Continue without thumbnail if generation fails
        }
        
        // Create new video document
        const video = new Video({
          title,
          movieName: movieName || 'Unknown',
          filePath: videoPath,
          thumbnailPath,
          tags: parsedTags,
          userId: req.body.userId || 'anonymous'
        });
        
        const savedVideo = await video.save();
        uploadedVideos.push(savedVideo);
      } catch (err) {
        console.error('Error processing file:', file.originalname, err);
        errors.push({ file: file.originalname, error: err.message });
        // Try to remove failed file
        try {
          await unlinkAsync(file.path);
        } catch (unlinkErr) {
          console.error('Failed to remove file after error:', unlinkErr);
        }
      }
    }

    if (uploadedVideos.length === 0) {
      return res.status(500).json({ 
        message: 'Failed to upload any videos', 
        errors 
      });
    }

    res.status(201).json({ 
      message: `Successfully uploaded ${uploadedVideos.length} videos${errors.length > 0 ? ` with ${errors.length} errors` : ''}`,
      uploadedVideos,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (err) {
    console.error('Batch upload error:', err);
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
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    const fullPath = path.join(uploadDir, fileName);

    // Delete file from filesystem
    try {
      if (fs.existsSync(fullPath)) {
        await unlinkAsync(fullPath);
      }
      
      // Also delete thumbnail if it exists
      if (video.thumbnailPath) {
        const thumbnailFileName = video.thumbnailPath.split('/').pop();
        if (thumbnailFileName) {
          const thumbnailPath = path.join(
            uploadDir, 
            'thumbnails', 
            thumbnailFileName
          );
          if (fs.existsSync(thumbnailPath)) {
            await unlinkAsync(thumbnailPath);
          }
        }
      }
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
