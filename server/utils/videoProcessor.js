
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

/**
 * Generates a thumbnail for a video file
 * @param {string} videoPath - Path to the video file
 * @param {string} outputDir - Directory where the thumbnail should be saved
 * @param {string} filename - Name for the thumbnail file
 * @param {string} timestamp - Timestamp to capture the thumbnail (default: '25%')
 * @returns {Promise<string|null>} - Path to the thumbnail or null if generation failed
 */
const createThumbnail = async (videoPath, outputDir, filename, timestamp = '25%') => {
  try {
    // Create thumbnails directory if it doesn't exist
    const thumbnailDir = path.join(outputDir, 'thumbnails');
    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
    }
    
    const thumbnailFilename = `thumb_${path.parse(filename).name}.jpg`;
    const thumbnailPath = path.join(thumbnailDir, thumbnailFilename);
    
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .on('error', (err) => {
          console.error('Error generating thumbnail:', err);
          reject(err);
        })
        .on('end', () => {
          resolve(thumbnailPath);
        })
        .screenshots({
          count: 1,
          folder: thumbnailDir,
          filename: thumbnailFilename,
          size: '320x240',
          timestamps: [timestamp]
        });
    });
  } catch (error) {
    console.error('Failed to generate thumbnail:', error);
    return null;
  }
};

module.exports = {
  createThumbnail
};
