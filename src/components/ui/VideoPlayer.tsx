
import React, { useRef, useEffect, useState } from "react";
import { Download, Play, Pause, Volume2, VolumeX, Maximize, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoData } from "@/data/mockData";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

interface VideoPlayerProps {
  video: VideoData;
  onDelete?: () => void;
  showDeleteButton?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onDelete, showDeleteButton = false }) => {
  const { title, filePath, tags, movieName, userId } = video;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Reset state when filePath changes
    setIsLoading(true);
    setHasError(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    
    // Reset and reload video when filePath changes
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.currentTime = 0;
    }
    
    // Log the file path to help with debugging
    console.log("Video file path:", filePath);
  }, [filePath]);
  
  // Handle metadata loaded - set duration
  const handleMetadataLoaded = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      console.log("Video metadata loaded, duration:", videoRef.current.duration);
    }
  };
  
  // Handle time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  
  // Handle video ended
  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };
  
  const handleLoadedData = () => {
    setIsLoading(false);
    console.log("Video loaded successfully");
  };
  
  const handleError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.error("Video error:", e, videoRef.current?.error);
    setIsLoading(false);
    setHasError(true);
    
    toast({
      title: "Video Error",
      description: "There was a problem playing this video. Please try again later.",
      variant: "destructive",
    });
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        // Try playing the video with catch for browser autoplay policy
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              console.log("Video started playing successfully");
            })
            .catch(err => {
              // Auto-play was prevented
              console.error("Playback error:", err);
              setIsPlaying(false);
              toast({
                title: "Playback Error",
                description: "Autoplay was blocked. Please click play again.",
                variant: "destructive",
              });
            });
        }
      }
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  // Format time (seconds to MM:SS)
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Toggle fullscreen
  const toggleFullScreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        toast({
          title: "Fullscreen Error",
          description: `Error attempting to enable fullscreen: ${err.message}`,
          variant: "destructive",
        });
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };
  
  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };
  
  // Handle delete video
  const handleDeleteVideo = async () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div ref={containerRef} className="bg-card rounded-lg overflow-hidden border border-border shadow-lg">
      <div className="aspect-video bg-black relative group">
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="animate-spin h-10 w-10 border-4 border-white/30 border-t-primary rounded-full"></div>
          </div>
        )}
        
        <video 
          ref={videoRef}
          className="w-full h-full object-contain bg-black"
          poster={video.thumbnailPath || '/placeholder.svg'}
          controls={false}
          onLoadedData={handleLoadedData}
          onLoadedMetadata={handleMetadataLoaded}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          onError={handleError}
          onClick={togglePlay}
          muted={isMuted}
          playsInline
          preload="auto"
        >
          <source src={filePath} type="video/mp4" />
          <source src={filePath} type="video/webm" />
          Your browser does not support the video tag.
        </video>
        
        {!isLoading && !hasError && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transform transition-opacity duration-300 opacity-0 group-hover:opacity-100">
            {/* Progress bar */}
            <div className="flex items-center mb-2">
              <input
                type="range"
                className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
              />
            </div>
            
            {/* Controls */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:bg-white/10 h-9 w-9 p-0 rounded-full"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:bg-white/10 h-9 w-9 p-0 rounded-full"
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                
                <span className="text-white text-xs">
                  {formatTime(currentTime)} / {formatTime(duration || 0)}
                </span>
              </div>
              
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:bg-white/10 h-9 w-9 p-0 rounded-full"
                  onClick={toggleFullScreen}
                >
                  <Maximize className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white z-10">
            <Play className="h-12 w-12 mb-2 opacity-50" />
            <p className="text-lg font-medium">Video failed to load</p>
            <p className="text-sm opacity-75 mb-4">The video format may be unsupported or the file may be corrupted</p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/10 hover:bg-white/20 border-white/30"
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.load(); // Reload the video
                    setHasError(false);
                    setIsLoading(true);
                  }
                }}
              >
                Try Again
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-primary/80 hover:bg-primary border-primary/30"
                onClick={() => window.open(filePath, '_blank')}
              >
                <Download className="h-4 w-4 mr-1" />
                <span>Download</span>
              </Button>
            </div>
          </div>
        )}
        
        {/* Large play button overlay */}
        {!isLoading && !hasError && !isPlaying && (
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={togglePlay}
          >
            <div className="rounded-full bg-primary/80 p-4 backdrop-blur-sm transition-transform hover:scale-110">
              <Play className="h-8 w-8 text-white" />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">{title}</h1>
            <p className="text-sm text-muted-foreground mb-3">
              From: <span className="text-meme-primary font-medium">{movieName}</span>
            </p>
          </div>
          <div className="flex gap-2">
            {showDeleteButton && (
              <Button 
                variant="destructive" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleDeleteVideo}
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => {
                window.open(filePath, '_blank');
                toast({
                  title: "Download Started",
                  description: "Your download should begin shortly.",
                });
              }}
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </Button>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span 
                key={tag} 
                className="inline-block text-xs px-3 py-1 bg-meme-primary/10 text-meme-primary rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
