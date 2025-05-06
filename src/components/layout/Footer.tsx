
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-meme-dark border-t border-muted py-8 px-4 mt-16">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-meme-primary mb-4">Memes4You</h3>
            <p className="text-muted-foreground">
              The best platform for movie meme enthusiasts to discover, share, and enjoy viral content.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-meme-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-muted-foreground hover:text-meme-primary transition-colors">
                  Browse
                </Link>
              </li>
              <li>
                <Link to="/upload" className="text-muted-foreground hover:text-meme-primary transition-colors">
                  Upload
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-foreground">Popular Categories</h4>
            <div className="flex flex-wrap gap-2">
              <Link to="/search?tag=funny" className="text-xs bg-secondary px-2 py-1 rounded-full hover:bg-meme-primary hover:text-meme-dark transition-colors">
                #funny
              </Link>
              <Link to="/search?tag=classic" className="text-xs bg-secondary px-2 py-1 rounded-full hover:bg-meme-primary hover:text-meme-dark transition-colors">
                #classic
              </Link>
              <Link to="/search?tag=action" className="text-xs bg-secondary px-2 py-1 rounded-full hover:bg-meme-primary hover:text-meme-dark transition-colors">
                #action
              </Link>
              <Link to="/search?tag=comedy" className="text-xs bg-secondary px-2 py-1 rounded-full hover:bg-meme-primary hover:text-meme-dark transition-colors">
                #comedy
              </Link>
              <Link to="/search?movie=starwars" className="text-xs bg-secondary px-2 py-1 rounded-full hover:bg-meme-primary hover:text-meme-dark transition-colors">
                Star Wars
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-muted mt-8 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Memes4You. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <span className="text-sm text-muted-foreground">
              Created with 💜 for meme lovers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
