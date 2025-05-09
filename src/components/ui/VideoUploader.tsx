
import React from "react";
import { Button } from "@/components/ui/button";
import VideoDropzone from "@/components/upload/VideoDropzone";
import VideoMetadataForm from "@/components/upload/VideoMetadataForm";
import UploadProgress from "@/components/upload/UploadProgress";
import { useVideoUpload } from "@/hooks/use-video-upload";

interface VideoUploaderProps {
  onSuccess?: () => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onSuccess }) => {
  const {
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
  } = useVideoUpload({ onSuccess });
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <VideoDropzone 
          preview={preview} 
          onFileChange={handleFileChange} 
          onRemoveFile={handleRemoveFile} 
        />
        
        <VideoMetadataForm
          title={title}
          setTitle={setTitle}
          movieName={movieName}
          setMovieName={setMovieName}
          tags={tags}
          setTags={setTags}
        />
      </div>
      
      <UploadProgress 
        isUploading={isUploading} 
        uploadProgress={uploadProgress} 
      />
      
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
