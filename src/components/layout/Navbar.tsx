
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="bg-meme-dark border-b border-muted py-3 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-meme-primary">Memes<span className="text-meme-accent">4</span>You</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-foreground hover:text-meme-primary transition-colors">
            Home
          </Link>
          <Link to="/search" className="text-foreground hover:text-meme-primary transition-colors">
            Browse
          </Link>
          <Link to="/upload" className="text-foreground hover:text-meme-primary transition-colors">
            Upload
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/search">
            <Button variant="ghost" size="icon" className="text-foreground hover:text-meme-primary hover:bg-secondary">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/upload">
            <Button className="bg-meme-primary hover:bg-meme-secondary text-meme-dark">
              Upload Meme
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
