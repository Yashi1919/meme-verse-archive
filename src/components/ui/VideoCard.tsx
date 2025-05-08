
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { VideoData } from "@/data/mockData";
import { Play, Film, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoCardProps {
  video: VideoData;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Check for valid video and ID (supporting both _id from API and id from mock data)
  if (!video || (!video.id && !video._id)) {
    return null; // Don't render cards without valid IDs
  }
  
  const videoId = video._id || video.id; // Use _id from API or fallback to id from mock data
  const { title, thumbnailPath, tags, movieName } = video;
  
  return (
    <Link 
      to={`/video/${videoId}`} 
      className="block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="rounded-lg overflow-hidden glass-card video-card-transition hover:border-meme-primary">
        <div className="aspect-video relative overflow-hidden bg-muted">
          <img 
            src={thumbnailPath || '/placeholder.svg'} 
            alt={title} 
            className={cn(
              "w-full h-full object-cover transition-transform duration-700",
              isHovered ? "scale-110" : "scale-100"
            )}
            onError={(e) => {
              // If thumbnail fails to load, set a placeholder
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity flex items-end justify-between",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            <div className="p-4 w-full">
              <p className="text-white font-medium truncate drop-shadow-md">{title}</p>
              <p className="text-white/80 text-xs mt-1">{movieName}</p>
            </div>
            <div className="absolute top-3 right-3 bg-black/60 rounded-full p-2">
              <Play size={18} className="text-white fill-white" />
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-md truncate flex-1">{title}</h3>
            <Film className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
          </div>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <Film className="h-3 w-3 mr-1" />
            <p className="truncate">{movieName}</p>
          </div>
          <div className="flex flex-wrap gap-1 mt-3">
            {tags && tags.slice(0, 3).map((tag) => (
              <span 
                key={`${videoId}-${tag}`}
                className="inline-block text-xs px-2 py-0.5 bg-secondary rounded-full text-secondary-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
