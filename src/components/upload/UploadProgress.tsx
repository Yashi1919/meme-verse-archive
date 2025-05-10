
import React from "react";
import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  isUploading: boolean;
  uploadProgress: number;
  fileName?: string;
}

const UploadProgress: React.FC<UploadProgressProps> = ({
  isUploading,
  uploadProgress,
  fileName,
}) => {
  if (!isUploading) return null;
  
  return (
    <div className="space-y-2">
      <Progress value={uploadProgress} className="h-2" />
      <p className="text-sm text-muted-foreground text-center">
        {fileName ? `Uploading ${fileName}... ` : "Uploading... "} 
        {uploadProgress}%
      </p>
    </div>
  );
};

export default UploadProgress;
