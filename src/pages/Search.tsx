
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { VideoData } from "@/data/mockData";
import { api } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SearchBar from "@/components/ui/SearchBar";
import VideoGrid from "@/components/ui/VideoGrid";
import { popularTags, popularMovies } from "@/data/mockData";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const query = searchParams.get("q") || "";
  const tagParam = searchParams.get("tag") || "";
  const movieParam = searchParams.get("movie") || "";
  
  const displayQuery = query || tagParam || movieParam || "";
  
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        let results: VideoData[] = [];
        
        if (query) {
          results = await api.searchVideos(query);
        } else if (tagParam) {
          results = await api.searchVideos(tagParam);
        } else if (movieParam) {
          results = await api.searchVideos(movieParam);
        } else {
          // If no query parameters, return all videos
          results = await api.getVideos();
        }
        
        setVideos(results);
      } catch (error) {
        console.error("Error searching videos:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, [query, tagParam, movieParam]);
  
  const handleSearch = (newQuery: string) => {
    setSearchParams({ q: newQuery });
  };
  
  const getSearchDescription = () => {
    if (query) return `Search results for "${query}"`;
    if (tagParam) return `Memes tagged with #${tagParam}`;
    if (movieParam) return `Memes from ${movieParam}`;
    return "Browse all memes";
  };
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar onSearch={handleSearch} initialQuery={displayQuery} />
          </div>
          
          {/* Filter tags */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {popularTags.slice(0, 8).map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchParams({ tag })}
                className={`text-xs px-2 py-1 rounded-full transition-colors
                  ${tagParam === tag 
                    ? "bg-meme-primary text-meme-dark" 
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-6 text-center">
          {getSearchDescription()}
        </h1>
        
        {loading ? (
          <div className="py-16 flex justify-center">
            <p className="text-muted-foreground">Loading memes...</p>
          </div>
        ) : (
          <VideoGrid 
            videos={videos} 
            emptyMessage="No memes found. Try a different search term." 
          />
        )}
        
        {/* Popular movies section, only show when no results */}
        {videos.length === 0 && !loading && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">Browse popular movies</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularMovies.slice(0, 8).map((movie) => (
                <button
                  key={movie}
                  onClick={() => setSearchParams({ movie })}
                  className="bg-card border border-border rounded-lg p-4 hover:border-meme-primary transition-colors text-left"
                >
                  <h3 className="font-medium">{movie}</h3>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Search;
