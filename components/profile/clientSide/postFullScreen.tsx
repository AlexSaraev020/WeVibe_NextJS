import Post from "@/components/cards/postCard/post";
import { PostType } from "@/types/post/postType";
import React from "react";

interface PostFullScreenProps {
  setShowPostFullScreen: (showPostFullScreen: boolean) => void;
  post: PostType;
  setPosts: (updatePosts: (prevPosts: PostType[]) => PostType[]) => void;
}
export default function PostFullScreen({
  setShowPostFullScreen,
  post,
  setPosts,
}: PostFullScreenProps) {
  const handleClickOutside = () => {
    setShowPostFullScreen(false);
  };

  const handleClickInside = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  return (
    <div
      onClick={handleClickOutside}
      className="fixed inset-0 z-50 flex w-full items-end justify-center bg-black/60 md:items-center"
    >
      <div
        onClick={handleClickInside}
        className=" w-full border-t-2 border-postBackground/50 flex items-center justify-center rounded-xl bg-black shadow-glow shadow-postBackground/50 md:w-5/12 md:border-none md:shadow-none"
      >
        <Post
          post={post}
          setPosts={setPosts}
          setShowPostFullScreen={setShowPostFullScreen}
        />
      </div>
    </div>
  );
}
