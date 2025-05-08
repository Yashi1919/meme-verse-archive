
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, Upload as UploadIcon, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

const NavbarEnhanced = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo & Menu Button */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="md:hidden"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl gradient-text">MemeMaster</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className={cn(
            "flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
            isActive("/") ? "text-foreground" : "text-foreground/60"
          )}>
            <Home className="mr-1 h-4 w-4" />
            Home
          </Link>
          <Link to="/search" className={cn(
            "flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
            isActive("/search") ? "text-foreground" : "text-foreground/60"
          )}>
            <Search className="mr-1 h-4 w-4" />
            Explore
          </Link>
          <Link to="/upload" className={cn(
            "flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
            isActive("/upload") ? "text-foreground" : "text-foreground/60"
          )}>
            <UploadIcon className="mr-1 h-4 w-4" />
            Upload
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/search">
            <Button variant="ghost" size="icon" className="text-foreground/60 hover:text-foreground">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/upload">
            <Button size="sm" className="hidden md:flex bg-meme-primary hover:bg-meme-secondary text-white">
              <UploadIcon className="mr-1 h-4 w-4" />
              Upload
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background">
          <div className="container py-4 flex flex-col space-y-3">
            <Link 
              to="/" 
              className={cn(
                "flex items-center px-2 py-1.5 rounded-md",
                isActive("/") ? "bg-muted text-foreground" : "text-foreground/70"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="mr-2 h-5 w-5" />
              Home
            </Link>
            <Link 
              to="/search" 
              className={cn(
                "flex items-center px-2 py-1.5 rounded-md",
                isActive("/search") ? "bg-muted text-foreground" : "text-foreground/70"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <Search className="mr-2 h-5 w-5" />
              Explore
            </Link>
            <Link 
              to="/upload" 
              className={cn(
                "flex items-center px-2 py-1.5 rounded-md",
                isActive("/upload") ? "bg-muted text-foreground" : "text-foreground/70"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <UploadIcon className="mr-2 h-5 w-5" />
              Upload
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavbarEnhanced;
