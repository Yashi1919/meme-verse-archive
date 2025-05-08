
import { useNavigate } from "react-router-dom";
import NavbarEnhanced from "@/components/layout/NavbarEnhanced";
import FooterEnhanced from "@/components/layout/FooterEnhanced";
import VideoUploader from "@/components/ui/VideoUploader";
import { FilmIcon, CheckCircle, HelpCircle } from "lucide-react";

const Upload = () => {
  const navigate = useNavigate();
  
  const handleUploadSuccess = () => {
    // Redirect to the homepage or search page after successful upload
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavbarEnhanced />
      <div className="container mx-auto px-4 py-12 max-w-3xl flex-1">
        <div className="mb-8 text-center">
          <FilmIcon className="h-12 w-12 mx-auto text-meme-primary mb-4" />
          <h1 className="text-3xl font-bold mb-2 gradient-text">Upload Your Meme</h1>
          <p className="text-muted-foreground">
            Share your favorite movie memes with the community
          </p>
        </div>
        
        <div className="glass-card p-6 rounded-lg">
          <VideoUploader onSuccess={handleUploadSuccess} />
        </div>
        
        <div className="mt-8 bg-card/60 backdrop-blur-sm border border-border rounded-lg p-6">
          <h3 className="text-md font-semibold mb-4 flex items-center">
            <HelpCircle className="h-5 w-5 mr-2 text-meme-primary" />
            Upload Tips
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 mr-2 text-meme-primary" />
              Videos should be under 100MB in size
            </li>
            <li className="flex items-center text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 mr-2 text-meme-primary" />
              Supported formats: MP4, MOV, AVI
            </li>
            <li className="flex items-center text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 mr-2 text-meme-primary" />
              Add relevant tags to help others find your meme
            </li>
            <li className="flex items-center text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 mr-2 text-meme-primary" />
              Include the movie name for better categorization
            </li>
          </ul>
        </div>
      </div>
      <FooterEnhanced />
    </div>
  );
};

export default Upload;
