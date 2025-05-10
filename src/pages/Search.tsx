
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search videos when query changes
  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let results;
        if (query.trim()) {
          results = await api.searchVideos(query);
        } else {
          results = await api.getVideos();
        }
        setVideos(results);
      } catch (err) {
        console.error("Error searching videos:", err);
        setError("Failed to load videos. Please try again.");
        setVideos([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVideos();
  }, [query]);
  
  const handleSearch = (value: string) => {
    setQuery(value);
    // Update URL with search query
    setSearchParams(value ? { q: value } : {});
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
