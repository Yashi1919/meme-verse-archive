
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";
import { VideoData } from "@/data/mockData";
import NavbarEnhanced from "@/components/layout/NavbarEnhanced";
import FooterEnhanced from "@/components/layout/FooterEnhanced";
import VideoGrid from "@/components/ui/VideoGrid";
import SearchBar from "@/components/ui/SearchBar";
import { FilmIcon } from "lucide-react";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [allVideos, setAllVideos] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch all videos once when component mounts
  useEffect(() => {
    const fetchAllVideos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const results = await api.getVideos();
        setAllVideos(results);
        
        // Initialize videos based on the current query
        if (query.trim()) {
          filterVideos(query, results);
        } else {
          setVideos(results);
        }
      } catch (err) {
        console.error("Error loading videos:", err);
        setError("Failed to load videos. Please try again.");
        setVideos([]);
        setAllVideos([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllVideos();
  }, []);
  
  // Filter videos client-side for dynamic filtering
  const filterVideos = (searchQuery: string, videoList = allVideos) => {
    if (!searchQuery.trim()) {
      return videoList;
    }
    
    const lowercaseQuery = searchQuery.toLowerCase();
    const filtered = videoList.filter(video => 
      video.title?.toLowerCase().includes(lowercaseQuery) || 
      video.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery)) || 
      video.movieName?.toLowerCase().includes(lowercaseQuery)
    );
    
    return filtered;
  };
  
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    
    // Update URL with search query
    setSearchParams(searchQuery ? { q: searchQuery } : {});
    
    // Filter videos client-side
    const filteredVideos = filterVideos(searchQuery);
    setVideos(filteredVideos);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavbarEnhanced />
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col items-center mb-8">
          <FilmIcon className="h-12 w-12 text-meme-primary mb-4" />
          <h1 className="text-3xl font-bold mb-4 gradient-text">Search Memes</h1>
          <SearchBar
            onSearch={handleSearch}
            initialQuery={initialQuery}
            className="w-full max-w-lg"
            dynamicSearch={true}
            placeholder="Start typing to search memes..."
          />
        </div>
        
        {error ? (
          <div className="text-center text-red-500 my-8">{error}</div>
        ) : (
          <VideoGrid videos={videos} isLoading={isLoading} />
        )}
      </main>
      <FooterEnhanced />
    </div>
  );
};

export default Search;
