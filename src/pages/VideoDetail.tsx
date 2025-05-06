
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { VideoData } from "@/data/mockData";
import { api } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VideoPlayer from "@/components/ui/VideoPlayer";
import VideoGrid from "@/components/ui/VideoGrid";
import { toast } from "@/components/ui/use-toast";

const VideoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<VideoData | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchVideo = async () => {
      // Validate ID
      if (!id || id === 'undefined') {
        toast({
          title: "Error",
          description: "Invalid video ID",
          variant: "destructive",
        });
        navigate('/');
        return;
      }
      
      try {
        setLoading(true);
        console.log("Fetching video with ID:", id); // Added for debugging
        const videoData = await api.getVideoById(id);
        
        if (videoData) {
          console.log("Video data received:", videoData); // Added for debugging
          setVideo(videoData);
          
          // Get related videos (with the same tags or movie)
          const allVideos = await api.getVideos();
          const related = allVideos
            .filter(v => v.id !== id) // Exclude current video
            .filter(v => 
              v.movieName === videoData.movieName || 
              v.tags.some(tag => videoData.tags.includes(tag))
            )
            .slice(0, 4); // Limit to 4 related videos
          
          setRelatedVideos(related);
        } else {
          // Video not found in API or mock data
          console.error("Video not found for ID:", id); // Added for debugging
          toast({
            title: "Video not found",
            description: "The requested video could not be found",
            variant: "destructive",
          });
          navigate('/');
        }
      } catch (error) {
        console.error("Error fetching video:", error);
        toast({
          title: "Error",
          description: "Failed to load the video",
          variant: "destructive",
        });
        navigate('/');
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
          <p className="text-muted-foreground">Loading video...</p>
        </div>
        <Footer />
      </>
    );
  }
  
  if (!video) {
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
          <VideoPlayer video={video} />
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
