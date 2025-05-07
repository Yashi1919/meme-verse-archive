
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

// This is a hybrid API that can work with both mock data and real backend
// It will use the backend if available, otherwise fall back to mock data
export const api = {
  // Get all videos
  getVideos: async (): Promise<VideoData[]> => {
    try {
      const response = await apiClient.get('/videos');
      return response.data;
    } catch (error) {
      console.error('Error fetching videos from API, using mock data:', error);
      // Simulate network delay for mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      // Fall back to mock data if the API call fails
      return import("@/data/mockData").then(module => module.mockVideos);
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
      return response.data;
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
      return response.data;
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
      
      const response = await apiClient.post('/videos/upload', videoData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading video to API:', error);
      throw error;
    }
  }
};
