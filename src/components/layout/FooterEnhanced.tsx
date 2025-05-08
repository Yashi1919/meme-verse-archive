
import React from "react";
import { Link } from "react-router-dom";
import { Github, Instagram, Twitter, Youtube } from "lucide-react";

const FooterEnhanced = () => {
  return (
    <footer className="border-t border-border/50 bg-background mt-auto">
      <div className="container px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold gradient-text mb-4">MemeMaster</h2>
            <p className="text-sm text-muted-foreground max-w-md">
              Discover and share the funniest movie moments in bite-sized clips. 
              MemeMaster is your go-to platform for movie memes that capture those
              perfect comedic moments.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-foreground/70 hover:text-foreground">
                <Twitter size={18} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-foreground/70 hover:text-foreground">
                <Instagram size={18} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-foreground/70 hover:text-foreground">
                <Github size={18} />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-foreground/70 hover:text-foreground">
                <Youtube size={18} />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link></li>
              <li><Link to="/search" className="text-muted-foreground hover:text-foreground transition-colors">Explore</Link></li>
              <li><Link to="/upload" className="text-muted-foreground hover:text-foreground transition-colors">Upload</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">DMCA</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} MemeMaster. All rights reserved.</p>
          <p className="text-xs text-muted-foreground mt-2 md:mt-0">
            Made with love for movie meme enthusiasts everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterEnhanced;
