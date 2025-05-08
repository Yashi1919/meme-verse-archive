
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { VideoData } from "@/data/mockData";
import { api } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VideoPlayer from "@/components/ui/VideoPlayer";
import VideoGrid from "@/components/ui/VideoGrid";
import { toast } from "@/components/ui/use-toast";
import { Loader, Trash2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const VideoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<VideoData | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("anonymous"); // In a real app, this would come from authentication
  const navigate = useNavigate();
  
  // Fetch the current user ID (in a real app, this would come from authentication)
  // For demo purposes, we're using localStorage
  useEffect(() => {
    const userId = localStorage.getItem("userId") || "anonymous";
    setCurrentUserId(userId);
  }, []);
  
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
  
  const handleDeleteVideo = async () => {
    if (!video || !id) return;
    
    try {
      setLoading(true);
      await api.deleteVideo(id);
      toast({
        title: "Success",
        description: "Video deleted successfully",
      });
      navigate("/");
    } catch (error) {
      console.error("Error deleting video:", error);
      toast({
        title: "Error",
        description: "Failed to delete the video",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const canDelete = video?.userId === currentUserId || currentUserId === "admin";
  
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-16 min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <Loader className="h-10 w-10 animate-spin mx-auto mb-6 text-meme-primary" />
            <p className="text-lg">Loading video...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  if (error || !video) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-16 min-h-[70vh] flex items-center justify-center">
          <div className="max-w-md w-full bg-card border border-border rounded-lg p-8 text-center shadow-lg">
            <h1 className="text-2xl font-bold mb-4">Video not found</h1>
            <p className="text-muted-foreground mb-8">
              The meme you're looking for doesn't exist or has been removed.
            </p>
            <Link 
              to="/" 
              className="inline-block px-6 py-3 rounded-full bg-meme-primary text-white hover:bg-meme-secondary transition-colors"
            >
              Go back to homepage
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 pb-16">
        <div className="max-w-4xl mx-auto mb-12">
          {video && (
            <>
              <VideoPlayer 
                video={video}
                showDeleteButton={canDelete}
                onDelete={() => document.getElementById("delete-dialog-trigger")?.click()}
              />
              
              {/* Hidden delete dialog trigger */}
              <AlertDialog>
                <AlertDialogTrigger id="delete-dialog-trigger" className="hidden">
                  Delete Video
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the video.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteVideo} className="bg-destructive hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
        
        {relatedVideos.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <div className="h-6 w-1 bg-meme-primary rounded-full"></div>
              Related Memes
            </h2>
            <VideoGrid videos={relatedVideos} />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default VideoDetail;
