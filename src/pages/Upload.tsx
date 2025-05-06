
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VideoUploader from "@/components/ui/VideoUploader";

const Upload = () => {
  const navigate = useNavigate();
  
  const handleUploadSuccess = () => {
    // Redirect to the homepage or search page after successful upload
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Upload Your Meme</h1>
          <p className="text-muted-foreground">
            Share your favorite movie memes with the community
          </p>
        </div>
        
        <VideoUploader onSuccess={handleUploadSuccess} />
        
        <div className="mt-8 bg-muted/30 rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-2">Upload Tips:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Videos should be under 100MB in size</li>
            <li>• Supported formats: MP4, MOV, AVI</li>
            <li>• Add relevant tags to help others find your meme</li>
            <li>• Include the movie name for better categorization</li>
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Upload;
