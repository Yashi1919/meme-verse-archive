
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import NavbarEnhanced from "@/components/layout/NavbarEnhanced";
import FooterEnhanced from "@/components/layout/FooterEnhanced";

const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavbarEnhanced />
      <div className="container mx-auto px-4 py-16 flex-1 flex flex-col justify-center items-center">
        <FileQuestion className="h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-muted-foreground text-lg mb-8 text-center max-w-md">
          The page you're looking for doesn't exist or has been moved to a new location.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild variant="default" size="lg">
            <Link to="/">Go Back Home</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/search">Search Memes</Link>
          </Button>
        </div>
      </div>
      <FooterEnhanced />
    </div>
  );
};

export default NotFound;
