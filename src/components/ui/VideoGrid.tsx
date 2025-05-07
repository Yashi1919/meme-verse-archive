
import React from "react";
import { VideoData } from "@/data/mockData";
import VideoCard from "./VideoCard";

interface VideoGridProps {
  videos: VideoData[];
  emptyMessage?: string;
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos, emptyMessage = "No videos found" }) => {
  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-xl text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {videos.map((video) => (
        // Use _id as key since that's what's coming from the API
        <VideoCard key={video._id || video.id} video={video} />
      ))}
    </div>
  );
};

export default VideoGrid;
