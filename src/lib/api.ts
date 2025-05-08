
import axios from 'axios';
import { VideoData } from "@/data/mockData";

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper to validate IDs
const isValidId = (id: string | undefined): boolean => {
  return !!id && id !== 'undefined' && id.length > 0;
};

// Helper to sanitize URLs for video playback
const sanitizeVideoUrl = (url: string): string => {
  // Make sure URL is properly formatted
  if (!url) return '';
  
  // Log the original URL for debugging
  console.log(`Sanitizing URL: ${url}`);
  
  // Check if URL is already absolute (has protocol)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    console.log(`URL is already absolute: ${url}`);
    return url;
  }
  
  // If it's a relative URL, make it absolute
  // Make sure to remove any leading slashes
  const sanitized = `${API_URL.replace(/\/api$/, '')}/${url.replace(/^\//, '')}`;
  console.log(`Sanitized URL: ${sanitized}`);
  return sanitized;
};

// This is a hybrid API that can work with both mock data and real backend
// It will use the backend if available, otherwise fall back to mock data
export const api = {
  // Get all videos
  getVideos: async (): Promise<VideoData[]> => {
    try {
      console.log('Attempting to fetch videos from API');
      const response = await apiClient.get('/videos');
      console.log('API response:', response.data);
      
      // Map MongoDB _id to id for consistent handling in the frontend
      const videos = response.data.map((video: any) => ({
        ...video,
        id: video._id, // Add id property based on _id for consistent handling
        filePath: sanitizeVideoUrl(video.filePath) // Ensure video URL is properly formatted
      }));
      
      return videos;
    } catch (error) {
      console.error('Error fetching videos from API, using mock data:', error);
      // Simulate network delay for mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      // Fall back to mock data if the API call fails
      console.log('Falling back to mock data');
      return import("@/data/mockData").then(module => {
        console.log('Mock data videos count:', module.mockVideos.length);
        return module.mockVideos;
      });
    }
  },
  
  // Get video by ID
  getVideoById: async (id: string | undefined): Promise<VideoData | undefined> => {
    // Validate ID before making the request
    if (!isValidId(id)) {
      console.error('Invalid video ID:', id);
      return undefined;
    }
    
    try {
      console.log(`Fetching video with ID: ${id}`);
      const response = await apiClient.get(`/videos/${id}`);
      console.log('API response for video:', response.data);
      
      // Add id property based on _id for consistent handling
      const video = {
        ...response.data,
        id: response.data._id,
        filePath: sanitizeVideoUrl(response.data.filePath) // Ensure video URL is properly formatted
      };
      
      return video;
    } catch (error) {
      console.error(`Error fetching video ID: ${id} from API, using mock data:`, error);
      await new Promise(resolve => setTimeout(resolve, 300));
      // Fall back to mock data
      return import("@/data/mockData").then(module => {
        const video = module.mockVideos.find(v => v.id === id);
        console.log(`Mock data search result for ID ${id}:`, video ? 'found' : 'not found');
        return video;
      });
    }
  },
  
  // Search videos by query
  searchVideos: async (query: string): Promise<VideoData[]> => {
    if (!query || query.trim().length === 0) {
      return api.getVideos(); // Return all videos if query is empty
    }
    
    try {
      const response = await apiClient.get(`/videos/search?q=${encodeURIComponent(query)}`);
      
      // Map MongoDB _id to id for consistent handling
      const videos = response.data.map((video: any) => ({
        ...video,
        id: video._id, // Add id property based on _id for consistent handling
        filePath: sanitizeVideoUrl(video.filePath) // Ensure video URL is properly formatted
      }));
      
      return videos;
    } catch (error) {
      console.error('Error searching videos from API, using mock data:', error);
      await new Promise(resolve => setTimeout(resolve, 300));
      // Fall back to mock search
      return import("@/data/mockData").then(module => {
        const lowercaseQuery = query.toLowerCase();
        return module.mockVideos.filter(video => 
          video.title.toLowerCase().includes(lowercaseQuery) ||
          video.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
          video.movieName.toLowerCase().includes(lowercaseQuery)
        );
      });
    }
  },
  
  // Upload a video
  uploadVideo: async (videoData: FormData): Promise<VideoData> => {
    try {
      // Ensure the FormData contains required fields
      if (!videoData.get('title')) {
        throw new Error('Title is required');
      }
      if (!videoData.get('tags')) {
        throw new Error('Tags are required');
      }
      if (!videoData.get('video')) {
        throw new Error('Video file is required');
      }
      
      // Add the user ID to the form data, if available
      if (!videoData.get('userId')) {
        const userId = localStorage.getItem("userId") || "anonymous";
        videoData.append('userId', userId);
      }
      
      const response = await apiClient.post('/videos/upload', videoData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        // Add timeout and retry logic
        timeout: 30000, // 30 second timeout
      });
      
      console.log("Upload response:", response.data);
      
      // Ensure the video URL is properly formatted
      const uploadedVideo = {
        ...response.data,
        id: response.data._id, // Ensure id is set
        filePath: sanitizeVideoUrl(response.data.filePath)
      };
      
      console.log("Processed uploaded video:", uploadedVideo);
      return uploadedVideo;
    } catch (error) {
      console.error('Error uploading video to API:', error);
      throw error;
    }
  },
  
  // Delete a video
  deleteVideo: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/videos/${id}`);
    } catch (error) {
      console.error('Error deleting video from API:', error);
      throw error;
    }
  }
};
