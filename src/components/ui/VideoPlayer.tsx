
import React, { useRef, useEffect, useState } from "react";
import { Download, Play, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoData } from "@/data/mockData";
import { toast } from "@/components/ui/use-toast";

interface VideoPlayerProps {
  video: VideoData;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
  const { title, filePath, tags, movieName } = video;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    // Reset state when filePath changes
    setIsLoading(true);
    setHasError(false);
    
    // Reset and reload video when filePath changes
    if (videoRef.current) {
      videoRef.current.load();
    }
    
    // Log the file path to help with debugging
    console.log("Video file path:", filePath);
  }, [filePath]);
  
  const handleLoadedData = () => {
    setIsLoading(false);
    console.log("Video loaded successfully");
  };
  
  const handleError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.error("Video error:", e);
    setIsLoading(false);
    setHasError(true);
    
    toast({
      title: "Video Error",
      description: "There was a problem playing this video. Please try again later.",
      variant: "destructive",
    });
  };

  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border">
      <div className="aspect-video bg-black relative">
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="animate-spin h-8 w-8 border-4 border-white/30 border-t-white rounded-full"></div>
          </div>
        )}
        
        <video 
          ref={videoRef}
          controls 
          className="w-full h-full"
          poster={video.thumbnailPath || '/placeholder.svg'}
          onLoadedData={handleLoadedData}
          onError={handleError}
        >
          <source src={filePath} type="video/mp4" />
          <source src={filePath} type="video/webm" />
          <source src={filePath} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
        
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white">
            <Play className="h-12 w-12 mb-2 opacity-50" />
            <p className="text-lg font-medium">Video failed to load</p>
            <p className="text-sm opacity-75 mb-4">The video format may be unsupported or the file may be corrupted</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/10 hover:bg-white/20 border-white/30"
              onClick={() => window.open(filePath, '_blank')}
            >
              Try Direct Download
            </Button>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold">{title}</h1>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => window.open(filePath, '_blank')}
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            From: <span className="text-meme-primary">{movieName}</span>
          </p>
          
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span 
                key={tag} 
                className="inline-block text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground"
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
