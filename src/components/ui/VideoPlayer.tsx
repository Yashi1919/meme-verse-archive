
import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoData } from "@/data/mockData";

interface VideoPlayerProps {
  video: VideoData;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
  const { title, filePath, tags, movieName } = video;
  
  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border">
      <div className="aspect-video bg-black">
        <video 
          src={filePath} 
          controls 
          className="w-full h-full"
          poster={video.thumbnailPath}
        >
          Your browser does not support the video tag.
        </video>
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
