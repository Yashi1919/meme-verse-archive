
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
  getVideoById: async (id: string): Promise<VideoData | undefined> => {
    // Validate ID before making the request
    if (!id || id === 'undefined') {
      console.error('Invalid video ID');
      return undefined;
    }
    
    try {
      const response = await apiClient.get(`/videos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching video by ID from API, using mock data:', error);
      await new Promise(resolve => setTimeout(resolve, 300));
      // Fall back to mock data
      return import("@/data/mockData").then(module => 
        module.mockVideos.find(video => video.id === id)
      );
    }
  },
  
  // Search videos by query
  searchVideos: async (query: string): Promise<VideoData[]> => {
    try {
      const response = await apiClient.get(`/videos/search?q=${query}`);
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
