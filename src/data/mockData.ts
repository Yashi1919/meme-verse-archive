
export interface VideoData {
  id: string;
  title: string;
  filePath: string;
  thumbnailPath: string;
  tags: string[];
  movieName: string;
  userId?: string;
  createdAt: string;
}

export const mockVideos: VideoData[] = [
  {
    id: "1",
    title: "That's what she said",
    filePath: "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4",
    thumbnailPath: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop",
    tags: ["funny", "office", "comedy"],
    movieName: "The Office",
    createdAt: "2023-05-01T12:00:00Z"
  },
  {
    id: "2",
    title: "I'll be back",
    filePath: "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4",
    thumbnailPath: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=250&fit=crop",
    tags: ["action", "classic", "terminator"],
    movieName: "Terminator",
    createdAt: "2023-05-02T12:00:00Z"
  },
  {
    id: "3",
    title: "May the Force be with you",
    filePath: "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4",
    thumbnailPath: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=250&fit=crop",
    tags: ["starwars", "sci-fi", "classic"],
    movieName: "Star Wars",
    createdAt: "2023-05-03T12:00:00Z"
  },
  {
    id: "4",
    title: "Here's Johnny!",
    filePath: "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4",
    thumbnailPath: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=250&fit=crop",
    tags: ["horror", "thriller", "classic"],
    movieName: "The Shining",
    createdAt: "2023-05-04T12:00:00Z"
  },
  {
    id: "5",
    title: "Show me the money!",
    filePath: "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4",
    thumbnailPath: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=250&fit=crop",
    tags: ["drama", "comedy", "sports"],
    movieName: "Jerry Maguire",
    createdAt: "2023-05-05T12:00:00Z"
  },
  {
    id: "6",
    title: "I see dead people",
    filePath: "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4",
    thumbnailPath: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop",
    tags: ["thriller", "horror", "twist"],
    movieName: "The Sixth Sense",
    createdAt: "2023-05-06T12:00:00Z"
  }
];

export const popularTags: string[] = [
  "funny", "action", "comedy", "classic", "horror", "sci-fi", "drama", "thriller", "twist", "superhero", "romance", "adventure"
];

export const popularMovies: string[] = [
  "The Office", "Terminator", "Star Wars", "The Shining", "Jerry Maguire", "The Sixth Sense", 
  "The Matrix", "The Godfather", "Pulp Fiction", "The Dark Knight", "Avengers", "Jurassic Park"
];
