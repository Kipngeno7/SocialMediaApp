import React, { createContext, useContext, useState, ReactNode, useMemo } from "react";

// -----------------------------
// ✅ Post type
// -----------------------------
export type Post = {
  text: string;
  category: string | null;
  mediaUris: string[];
  audioUri: string | null;
  hashtags: string;
  location: string;
  visibility: "public" | "followers" | "private";
  user: { name: string; avatar: string };
  likes?: string[]; // array of user IDs who liked
  comments?: { user: string; text: string }[]; // simple comment objects
  liveStartTime?: number; // timestamp if live
  createdAt?: number; // timestamp for post creation
  score?: number; // for ranking
};

// -----------------------------
// ✅ Context type
// -----------------------------
type PostsContextType = {
  posts: Post[];
  addPost: (post: Post) => void;
  rankedPosts: Post[]; // posts after ranking
};

// -----------------------------
// ✅ Context
// -----------------------------
const PostsContext = createContext<PostsContextType>({
  posts: [],
  addPost: () => {},
  rankedPosts: [],
});

// -----------------------------
// ✅ Provider
// -----------------------------
export const PostsProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  // Add post with initialized values
  const addPost = (post: Post) =>
    setPosts((prev) => [
      { ...post, createdAt: Date.now(), likes: [], comments: [] },
      ...prev,
    ]);

  // -----------------------------
  // ✅ Precompute ranked posts whenever posts change (optimized)
  // -----------------------------
  const rankedPosts = useMemo(() => {
    return posts
      .map((p) => {
        const ageMinutes = (Date.now() - (p.createdAt ?? Date.now())) / 60000;
        const score =
          (p.likes?.length || 0) * 2 +
          (p.comments?.length || 0) * 3 +
          (p.liveStartTime ? 5 : 0) -
          ageMinutes;
        return { ...p, score };
      })
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }, [posts]);

  return (
    <PostsContext.Provider value={{ posts, rankedPosts, addPost }}>
      {children}
    </PostsContext.Provider>
  );
};

// -----------------------------
// ✅ Hook
// -----------------------------
export const usePosts = () => useContext(PostsContext);