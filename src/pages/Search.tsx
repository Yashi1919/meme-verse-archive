
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { VideoData } from "@/data/mockData";
import { api } from "@/lib/api";
import NavbarEnhanced from "@/components/layout/NavbarEnhanced";
import FooterEnhanced from "@/components/layout/FooterEnhanced";
import SearchBar from "@/components/ui/SearchBar";
import VideoGrid from "@/components/ui/VideoGrid";
import { popularTags, popularMovies } from "@/data/mockData";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  
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
          setActiveTab("all");
        } else if (tagParam) {
          results = await api.searchVideos(tagParam);
          setActiveTab("tags");
        } else if (movieParam) {
          results = await api.searchVideos(movieParam);
          setActiveTab("movies");
        } else {
          // If no query parameters, return all videos
          results = await api.getVideos();
          setActiveTab("all");
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
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (value === "tags") {
      // Clear other parameters and show tags
      setSearchParams({});
    } else if (value === "movies") {
      // Clear other parameters and show movies
      setSearchParams({});
    } else {
      // Clear all parameters
      setSearchParams({});
    }
  };
  
  const getSearchDescription = () => {
    if (query) return `Search results for "${query}"`;
    if (tagParam) return `Memes tagged with #${tagParam}`;
    if (movieParam) return `Memes from ${movieName}`;
    return "Browse all memes";
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavbarEnhanced />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar onSearch={handleSearch} initialQuery={displayQuery} />
          </div>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mb-8">
            <TabsList className="w-full max-w-md mx-auto">
              <TabsTrigger value="all" className="flex-1">All Memes</TabsTrigger>
              <TabsTrigger value="tags" className="flex-1">Popular Tags</TabsTrigger>
              <TabsTrigger value="movies" className="flex-1">Movies</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              {/* This will show search results or all videos */}
            </TabsContent>
            
            <TabsContent value="tags" className="mt-6">
              <div className="flex flex-wrap gap-3 justify-center">
                {popularTags.slice(0, 20).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchParams({ tag })}
                    className={`px-3 py-1.5 rounded-full transition-colors
                      ${tagParam === tag 
                        ? "bg-meme-primary text-white" 
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="movies" className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {popularMovies.slice(0, 12).map((movie) => (
                  <button
                    key={movie}
                    onClick={() => setSearchParams({ movie })}
                    className="bg-card hover:bg-card/80 border border-border rounded-lg p-4 hover:border-meme-primary transition-colors text-left h-full"
                  >
                    <h3 className="font-medium">{movie}</h3>
                  </button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {(query || tagParam || movieParam) && (
          <h1 className="text-2xl font-bold mb-6">
            {getSearchDescription()}
          </h1>
        )}
        
        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-32 bg-muted rounded"></div>
              <div className="h-4 w-64 bg-muted rounded"></div>
            </div>
          </div>
        ) : (
          <VideoGrid 
            videos={videos} 
            emptyMessage="No memes found. Try a different search term." 
          />
        )}
        
        {/* Popular movies section, only show when no results and not on movies tab */}
        {videos.length === 0 && !loading && activeTab !== "movies" && (
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
      <FooterEnhanced />
    </div>
  );
};

export default Search;
