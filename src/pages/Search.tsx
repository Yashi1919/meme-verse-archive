
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import NavbarEnhanced from "@/components/layout/NavbarEnhanced";
import FooterEnhanced from "@/components/layout/FooterEnhanced";
import VideoGrid from "@/components/ui/VideoGrid";
import SearchBar from "@/components/ui/SearchBar";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Filter, SlidersHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchValue, setSearchValue] = useState(query);
  const { toast } = useToast();
  
  const {
    data: videos,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["videos", query],
    queryFn: () => api.searchVideos(query),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  useEffect(() => {
    setSearchValue(query);
  }, [query]);
  
  const handleSearch = (value: string) => {
    setSearchParams({ q: value });
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch(searchValue);
  };
  
  return (
    <>
      <NavbarEnhanced />
      <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-80px)]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-6 text-gradient flex items-center">
              <SearchIcon className="mr-2 h-8 w-8" />
              Search Results
            </h1>
            
            <div className="w-full">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <SearchBar 
                  value={searchValue}
                  setValue={setSearchValue}
                  placeholder="Search by title, movie, or tags..." 
                  className="w-full"
                />
                <Button type="submit" className="neo-blur text-white">
                  <SearchIcon className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </form>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="w-full h-48 rounded-lg" />
                  <Skeleton className="w-3/4 h-6 rounded-md" />
                  <Skeleton className="w-1/2 h-4 rounded-md" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">
                Error loading search results. Please try again.
              </p>
              <Button onClick={() => refetch()} className="neo-blur text-white">
                Retry
              </Button>
            </div>
          ) : videos && videos.length > 0 ? (
            <>
              <p className="text-muted-foreground mb-6">
                Found {videos.length} results for "{query}"
              </p>
              <VideoGrid videos={videos} />
            </>
          ) : (
            <div className="text-center py-16 glass-morphism rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">No results found</h2>
              <p className="text-muted-foreground mb-8">
                We couldn't find any memes matching "{query}"
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => setSearchParams({})} variant="outline" className="neo-blur">
                  Clear Search
                </Button>
                <Button onClick={() => window.location.href = "/"} className="neo-blur text-white">
                  Back to Home
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <FooterEnhanced />
    </>
  );
};

export default Search;
