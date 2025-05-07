
import React, { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

interface VideoUploaderProps {
  onSuccess?: () => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [movieName, setMovieName] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create a preview for video
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a video file to upload",
        variant: "destructive",
      });
      return;
    }
    
    if (!title) {
      toast({
        title: "Error",
        description: "Please enter a title for your meme",
        variant: "destructive", 
      });
      return;
    }
    
    if (!tags) {
      toast({
        title: "Error",
        description: "Please enter at least one tag for your meme",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(10); // Start progress indicator
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('video', file);
      formData.append('title', title);
      formData.append('movieName', movieName || 'Unknown');
      formData.append('tags', tags);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 500);
      
      // Upload to the backend
      const response = await api.uploadVideo(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast({
        title: "Success",
        description: "Your meme was uploaded successfully!",
      });
      
      // Reset form
      setTitle("");
      setMovieName("");
      setTags("");
      setFile(null);
      setPreview(null);
      setUploadProgress(0);
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your meme. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="bg-card rounded-lg border border-dashed border-border p-6 flex flex-col items-center justify-center">
          {preview ? (
            <div className="w-full max-w-lg">
              <div className="aspect-video rounded-md overflow-hidden bg-black">
                <video src={preview} controls className="w-full h-full" />
              </div>
              <Button
                type="button"
                variant="ghost"
                className="mt-2 text-sm text-muted-foreground"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
              >
                Remove video
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center py-10">
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Drop your meme here</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Supports MP4, MOV, AVI (up to 100MB)
                </p>
                <Input
                  id="file-upload"
                  type="file"
                  accept="video/mp4,video/mov,video/avi"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-meme-primary hover:bg-meme-secondary text-meme-dark font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Select File
                </Label>
              </div>
            </>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter a catchy title for your meme"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="movie">Movie Name</Label>
            <Input
              id="movie"
              value={movieName}
              onChange={e => setMovieName(e.target.value)}
              placeholder="Which movie is this meme from?"
            />
          </div>
          
          <div>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Textarea
              id="tags"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="funny, action, classic"
              rows={2}
              required
            />
          </div>
        </div>
      </div>
      
      {isUploading && (
        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
          <div 
            className="bg-meme-primary h-full transition-all duration-300 ease-in-out"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
      
      <Button
        type="submit"
        disabled={isUploading || !file}
        className="w-full bg-meme-primary hover:bg-meme-secondary text-meme-dark"
      >
        {isUploading ? "Uploading..." : "Upload Meme"}
      </Button>
    </form>
  );
};

export default VideoUploader;
