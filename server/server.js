
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const corsOptions = {
  origin: [
    'http://localhost:8080', // Your local frontend dev server
    // Add any other origins you need to allow in the future (e.g., your deployed frontend URL)
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Common methods
  allowedHeaders: [
    'Content-Type', // Allow standard content type header
    'Authorization', // If you use authorization headers
    'ngrok-skip-browser-warning' // <--- ADD THIS LINE
  ],
  credentials: true // Set to true if you ever use cookies/sessions that need to be sent cross-origin
};




// Import routes
const videoRoutes = require('./routes/videos');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Create thumbnails directory
const thumbnailsDir = path.join(uploadDir, 'thumbnails');
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

// Middlewares

app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from uploads directory
// Make the path absolute for reliable file serving
app.use('/uploads', express.static(path.join(__dirname, uploadDir)));

// Routes
app.use('/api/videos', videoRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
