
import React from "react";
import { VideoData } from "@/data/mockData";
import VideoCard from "./VideoCard";

interface VideoGridProps {
  videos: VideoData[];
  emptyMessage?: string;
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos, emptyMessage = "No videos found" }) => {
  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-xl text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
};

export default VideoGrid;
