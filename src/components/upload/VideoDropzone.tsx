
import React from "react";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface VideoDropzoneProps {
  preview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
}

const VideoDropzone: React.FC<VideoDropzoneProps> = ({
  preview,
  onFileChange,
  onRemoveFile,
}) => {
  return (
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
            onClick={onRemoveFile}
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
              onChange={onFileChange}
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
  );
};

export default VideoDropzone;
