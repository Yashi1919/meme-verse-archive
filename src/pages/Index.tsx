
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { VideoData } from "@/data/mockData";
import NavbarEnhanced from "@/components/layout/NavbarEnhanced";
import FooterEnhanced from "@/components/layout/FooterEnhanced";
import VideoGrid from "@/components/ui/VideoGrid";

// We're creating a custom version of Index.tsx that uses our enhanced components

const Index = () => {
  const [featuredVideo, setFeaturedVideo] = useState<VideoData | null>(null);
  
  const { data: videos, isLoading, error } = useQuery({
    queryKey: ['videos'],
    queryFn: api.getVideos
  });
  
  useEffect(() => {
    if (videos && videos.length > 0) {
      // Get a random video for the featured spot
      const randomIndex = Math.floor(Math.random() * Math.min(videos.length, 5));
      setFeaturedVideo(videos[randomIndex]);
    }
  }, [videos]);

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarEnhanced />
      
      <main className="flex-1">
        {/* Hero Section with Featured Video */}
        <section className="relative bg-hero-pattern dark:bg-opacity-20">
          <div className="container mx-auto px-4 py-12 md:py-24">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-float">
                <span className="gradient-text">Movie Memes</span> For Everyone
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Discover, share, and laugh with the internet's best movie moments
              </p>
            </div>
          </div>
        </section>
        
        {/* Main Content */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-8 flex items-center">
            <span className="gradient-text mr-2">Latest</span> Movie Memes
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-pulse-glow text-center">
                <p className="text-muted-foreground">Loading awesome memes...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-destructive">Failed to load videos</p>
            </div>
          ) : (
            <VideoGrid videos={videos || []} />
          )}
          
          {/* Trending Section */}
          {videos && videos.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8">
                <span className="gradient-text">Trending</span> This Week
              </h2>
              <VideoGrid videos={videos.slice(0, 6)} />
            </div>
          )}
        </section>
      </main>
      
      <FooterEnhanced />
    </div>
  );
};

export default Index;
