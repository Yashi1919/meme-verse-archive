
import React, { useState, FormEvent, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
  placeholder?: string;
  className?: string;
  dynamicSearch?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  initialQuery = "",
  placeholder = "Search memes by tags, movie names...",
  className,
  dynamicSearch = false,
}) => {
  const [query, setQuery] = useState(initialQuery);
  
  // If dynamicSearch is enabled, trigger search on query change
  useEffect(() => {
    if (dynamicSearch) {
      const debounceTimer = setTimeout(() => {
        onSearch(query);
      }, 300); // Add a small debounce to avoid too many API calls
      
      return () => clearTimeout(debounceTimer);
    }
  }, [query, dynamicSearch, onSearch]);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    // For non-dynamic search, we'll still rely on the submit button/form
    // Dynamic search is handled by the useEffect above
  };
  
  return (
    <form onSubmit={handleSubmit} className={cn("w-full flex", className)}>
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          className="w-full pl-10 bg-secondary border-secondary"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
      {!dynamicSearch && (
        <Button 
          type="submit" 
          className="ml-2 bg-meme-primary hover:bg-meme-secondary text-meme-dark"
        >
          Search
        </Button>
      )}
    </form>
  );
};

export default SearchBar;
