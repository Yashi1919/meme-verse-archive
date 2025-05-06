
import { VideoData, mockVideos } from "@/data/mockData";

// This is a mock API service that simulates backend calls
// In a real application, these would be actual API calls using fetch or axios

export const api = {
  // Get all videos
  getVideos: async (): Promise<VideoData[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockVideos;
  },
  
  // Get video by ID
  getVideoById: async (id: string): Promise<VideoData | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockVideos.find(video => video.id === id);
  },
  
  // Search videos by query
  searchVideos: async (query: string): Promise<VideoData[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lowercaseQuery = query.toLowerCase();
    
    return mockVideos.filter(video => 
      video.title.toLowerCase().includes(lowercaseQuery) ||
      video.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      video.movieName.toLowerCase().includes(lowercaseQuery)
    );
  },
  
  // Upload a video (mock implementation)
  uploadVideo: async (videoData: Omit<VideoData, "id" | "createdAt">): Promise<VideoData> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newVideo: VideoData = {
      ...videoData,
      id: `${mockVideos.length + 1}`,
      createdAt: new Date().toISOString()
    };
    
    // In a real implementation, this would POST to the backend
    console.log("Video uploaded:", newVideo);
    
    return newVideo;
  }
};
