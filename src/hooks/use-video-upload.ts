
import { useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface UseVideoUploadProps {
  onSuccess?: () => void;
}

export function useVideoUpload({ onSuccess }: UseVideoUploadProps = {}) {
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
  
  const handleRemoveFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
  };
  
  const resetForm = () => {
    setTitle("");
    setMovieName("");
    setTags("");
    handleRemoveFile();
    setUploadProgress(0);
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
      await api.uploadVideo(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast({
        title: "Success",
        description: "Your meme was uploaded successfully!",
      });
      
      // Reset form
      resetForm();
      
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
  
  return {
    isUploading,
    title,
    setTitle,
    movieName,
    setMovieName,
    tags,
    setTags,
    file,
    preview,
    uploadProgress,
    handleFileChange,
    handleRemoveFile,
    handleSubmit,
  };
}
