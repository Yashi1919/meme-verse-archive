
import React, { useState } from "react";
import { FilmIcon, Upload, X, Plus, Film, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

interface BatchUploaderProps {
  onSuccess?: () => void;
}

const BatchUploader: React.FC<BatchUploaderProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [movieName, setMovieName] = useState("");
  const [tags, setTags] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      
      // Create previews for videos
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };
  
  const removeFile = (index: number) => {
    // Release object URL to prevent memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    
    // Remove file and preview from state
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one video file to upload",
        variant: "destructive",
      });
      return;
    }
    
    if (!tags) {
      toast({
        title: "Error",
        description: "Please enter at least one tag for your memes",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(10); // Start progress indicator
      
      // Create FormData for file upload
      const formData = new FormData();
      files.forEach(file => {
        formData.append('videos', file);
      });
      
      formData.append('movieName', movieName || 'Unknown');
      formData.append('tags', tags);
      
      // Add user ID if available
      const userId = localStorage.getItem("userId") || "anonymous";
      formData.append('userId', userId);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 5, 90));
      }, 500);
      
      // Upload to the backend
      const response = await api.uploadBatchVideos(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast({
        title: "Success",
        description: `Successfully uploaded ${response.uploadedVideos.length} videos!`,
      });
      
      // Reset form
      setMovieName("");
      setTags("");
      setFiles([]);
      setPreviewUrls([]);
      setUploadProgress(0);
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Batch upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your memes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {files.length === 0 ? (
          <div className="bg-card rounded-lg border border-dashed border-border p-6 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center py-10">
              <FilmIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Drop your meme videos here</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload multiple videos from the same movie (up to 10 files, 100MB each)
              </p>
              <Input
                id="file-upload"
                type="file"
                accept="video/mp4,video/mov,video/avi"
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
              <Label
                htmlFor="file-upload"
                className="cursor-pointer bg-meme-primary hover:bg-meme-secondary text-meme-dark font-medium py-2 px-4 rounded-md transition-colors"
              >
                Select Files
              </Label>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{files.length} videos selected</h3>
              <div className="flex gap-2">
                <Input
                  id="add-more"
                  type="file"
                  accept="video/mp4,video/mov,video/avi"
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
                <Label
                  htmlFor="add-more"
                  className="cursor-pointer inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add more
                </Label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="text-sm text-destructive hover:text-destructive/80"
                  onClick={() => {
                    previewUrls.forEach(url => URL.revokeObjectURL(url));
                    setFiles([]);
                    setPreviewUrls([]);
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear all
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto p-2">
              {files.map((file, index) => (
                <Card key={index} className="overflow-hidden relative group">
                  <CardContent className="p-2">
                    <div className="aspect-video bg-black rounded overflow-hidden">
                      <video 
                        src={previewUrls[index]} 
                        className="w-full h-full object-contain" 
                        muted 
                      />
                    </div>
                    <div className="pt-2 flex justify-between items-center">
                      <p className="text-sm truncate" title={file.name}>
                        {file.name}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto opacity-80 hover:opacity-100"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="movie">Movie Name</Label>
            <Input
              id="movie"
              value={movieName}
              onChange={e => setMovieName(e.target.value)}
              placeholder="Which movie are these memes from?"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Common movie name will be applied to all videos
            </p>
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
            <p className="text-sm text-muted-foreground mt-1">
              Common tags will be applied to all videos
            </p>
          </div>
        </div>
      </div>
      
      {isUploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-sm text-muted-foreground text-center">
            Uploading {files.length} videos... {uploadProgress}%
          </p>
        </div>
      )}
      
      <Button
        type="submit"
        disabled={isUploading || files.length === 0}
        className="w-full bg-meme-primary hover:bg-meme-secondary text-meme-dark"
      >
        {isUploading ? "Uploading..." : `Upload ${files.length} Memes`}
      </Button>
    </form>
  );
};

export default BatchUploader;
