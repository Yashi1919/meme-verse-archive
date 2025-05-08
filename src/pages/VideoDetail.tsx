
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { VideoData } from "@/data/mockData";
import { api } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VideoPlayer from "@/components/ui/VideoPlayer";
import VideoGrid from "@/components/ui/VideoGrid";
import { toast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const VideoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<VideoData | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchVideo = async () => {
      // Reset state when ID changes
      setVideo(null);
      setRelatedVideos([]);
      setError(null);
      setLoading(true);
      
      // Validate ID
      if (!id || id === 'undefined') {
        setError("Invalid video ID");
        toast({
          title: "Error",
          description: "Invalid video ID",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      try {
        console.log("Fetching video with ID:", id);
        const videoData = await api.getVideoById(id);
        
        if (videoData) {
          console.log("Video data received:", videoData);
          // Validate that we have a file path
          if (!videoData.filePath) {
            throw new Error("Video has no file path");
          }
          
          setVideo(videoData);
          
          // Get related videos (with the same tags or movie)
          const allVideos = await api.getVideos();
          // Make sure we're looking for videos with the same tags or movie
          const related = allVideos
            .filter(v => (v._id || v.id) !== id) // Exclude current video using _id or id
            .filter(v => 
              v.movieName === videoData.movieName || 
              v.tags.some(tag => videoData.tags.includes(tag))
            )
            .slice(0, 4); // Limit to 4 related videos
          
          setRelatedVideos(related);
        } else {
          console.error("Video not found for ID:", id);
          setError("Video not found");
          toast({
            title: "Video not found",
            description: "The requested video could not be found",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching video:", error);
        setError("Failed to load video");
        toast({
          title: "Error",
          description: "Failed to load the video",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideo();
  }, [id, navigate]);
  
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading video...</p>
        </div>
        <Footer />
      </>
    );
  }
  
  if (error || !video) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Video not found</h1>
          <p className="text-muted-foreground mb-8">
            The meme you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            to="/" 
            className="text-meme-primary hover:text-meme-secondary underline"
          >
            Go back to homepage
          </Link>
        </div>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-12">
          {video && (
            <>
              <VideoPlayer video={video} />
              {/* Add debugging info for developers - can be removed in production */}
              <div className="mt-4 p-2 border border-muted rounded text-xs text-muted-foreground bg-muted/10">
                <details>
                  <summary>Debug Info</summary>
                  <p>Video ID: {video._id || video.id}</p>
                  <p>File Path: {video.filePath}</p>
                </details>
              </div>
            </>
          )}
        </div>
        
        {relatedVideos.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Memes</h2>
            <VideoGrid videos={relatedVideos} />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default VideoDetail;
