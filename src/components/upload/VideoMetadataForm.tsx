
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface VideoMetadataFormProps {
  title: string;
  setTitle: (value: string) => void;
  movieName: string;
  setMovieName: (value: string) => void;
  tags: string;
  setTags: (value: string) => void;
}

const VideoMetadataForm: React.FC<VideoMetadataFormProps> = ({
  title,
  setTitle,
  movieName,
  setMovieName,
  tags,
  setTags,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a catchy title for your meme"
          required
        />
      </div>

      <div>
        <Label htmlFor="movie">Movie Name</Label>
        <Input
          id="movie"
          value={movieName}
          onChange={(e) => setMovieName(e.target.value)}
          placeholder="Which movie is this meme from?"
        />
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Textarea
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="funny, action, classic"
          rows={2}
          required
        />
      </div>
    </div>
  );
};

export default VideoMetadataForm;
