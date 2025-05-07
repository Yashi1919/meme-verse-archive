
import React from "react";
import { Link } from "react-router-dom";
import { VideoData } from "@/data/mockData";

interface VideoCardProps {
  video: VideoData;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  if (!video || !video.id) {
    return null; // Don't render cards without valid IDs
  }
  
  const { id, title, thumbnailPath, tags, movieName } = video;
  
  return (
    <Link to={`/video/${id}`} className="block">
      <div className="rounded-lg overflow-hidden bg-card border border-border video-card-transition hover:border-meme-primary">
        <div className="aspect-video relative overflow-hidden bg-muted">
          <img 
            src={thumbnailPath || '/placeholder.svg'} 
            alt={title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // If thumbnail fails to load, set a placeholder
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end">
            <div className="p-4 w-full">
              <p className="text-white font-medium truncate">{title}</p>
            </div>
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-medium text-md truncate">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">From: {movieName}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {tags && tags.slice(0, 3).map((tag) => (
              <span 
                key={`${id}-${tag}`}
                className="inline-block text-xs px-2 py-0.5 bg-secondary rounded-full text-muted-foreground"
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
