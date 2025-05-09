
import React from "react";

interface UploadProgressProps {
  isUploading: boolean;
  uploadProgress: number;
}

const UploadProgress: React.FC<UploadProgressProps> = ({
  isUploading,
  uploadProgress,
}) => {
  if (!isUploading) return null;
  
  return (
    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
      <div
        className="bg-meme-primary h-full transition-all duration-300 ease-in-out"
        style={{ width: `${uploadProgress}%` }}
      />
    </div>
  );
};

export default UploadProgress;
