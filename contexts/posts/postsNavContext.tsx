"use client";
import { PostType } from "@/types/post/postType";
import { createContext, useContext, useMemo, useState } from "react";

interface PostsNavContextType {
  posts: PostType[] | [];
  setPosts: (updatePosts: (prevPosts: PostType[]) => PostType[]) => void;
}

const PostsNavContext = createContext<PostsNavContextType>({
  posts: [],
  setPosts: () => {},
});

export const PostsNavContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const value = useMemo(() => ({ posts, setPosts }), [posts]);
  return (
    <PostsNavContext.Provider value={value}>
      {children}
    </PostsNavContext.Provider>
  );
};

export const usePostsNav = () => useContext(PostsNavContext);
