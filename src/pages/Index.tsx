
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import VideoGrid from "@/components/ui/VideoGrid";
import SearchBar from "@/components/ui/SearchBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { api } from "@/lib/api";
import { popularTags, popularMovies } from "@/data/mockData";
import { VideoData } from "@/data/mockData";
import { Loader } from "lucide-react";

const Index = () => {
  const [featuredVideos, setFeaturedVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        console.log("Fetching videos for featured section");
        const videos = await api.getVideos();
        console.log("Fetched videos:", videos);
        
        // Make sure we have an array of valid videos
        if (Array.isArray(videos) && videos.length > 0) {
          setFeaturedVideos(videos);
        } else {
          console.warn("No videos returned from API");
          setError("No videos available");
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
        setError("Failed to load videos");
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, []);
  
  const handleSearch = (query: string) => {
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative rounded-xl overflow-hidden mb-12 bg-meme-dark">
          <div className="absolute inset-0 bg-gradient-to-r from-meme-dark to-transparent z-10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=400&fit=crop')] bg-cover bg-center opacity-40"></div>
          
          <div className="relative z-20 py-16 px-6 md:py-24 md:px-12">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                Discover & Share <span className="text-meme-primary">Movie Memes</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-8">
                The ultimate collection of funny, iconic, and memorable movie moments in meme format.
                Find the perfect reaction for any situation!
              </p>
              
              <div className="max-w-lg">
                <SearchBar onSearch={handleSearch} />
              </div>
              
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="text-sm text-white/70">Popular Tags:</span>
                {popularTags.slice(0, 5).map((tag) => (
                  <Link 
                    key={tag}
                    to={`/search?tag=${tag}`}
                    className="text-xs bg-secondary/50 hover:bg-meme-primary hover:text-meme-dark px-2 py-1 rounded-full transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Featured Memes */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Memes</h2>
            <Link to="/search" className="text-meme-primary hover:text-meme-secondary">
              View all
            </Link>
          </div>
          
          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground ml-2">Loading memes...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">{error}</p>
            </div>
          ) : (
            <VideoGrid videos={featuredVideos.slice(0, 4)} emptyMessage="No featured memes available" />
          )}
        </div>
        
        {/* Popular Movies */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Popular Movies</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {popularMovies.slice(0, 8).map((movie) => (
              <Link
                key={movie}
                to={`/search?movie=${encodeURIComponent(movie)}`}
                className="bg-card border border-border rounded-lg p-4 hover:border-meme-primary transition-colors"
              >
                <h3 className="font-medium">{movie}</h3>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Upload CTA */}
        <div className="rounded-lg bg-meme-primary/10 p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Got a Hilarious Movie Meme?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Share your favorite movie moments with the community. Upload your meme and make someone's day!
          </p>
          <Link to="/upload">
            <Button className="bg-meme-primary hover:bg-meme-secondary text-meme-dark">
              Upload Your Meme
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Index;
