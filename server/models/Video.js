
const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  filePath: {
    type: String,
    required: true
  },
  thumbnailPath: {
    type: String,
    required: false
  },
  tags: {
    type: [String],
    required: true
  },
  movieName: {
    type: String,
    required: false
  },
  userId: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add text index for search functionality
videoSchema.index({ title: 'text', movieName: 'text', tags: 'text' });

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
