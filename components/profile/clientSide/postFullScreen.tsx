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
      <div onClick={handleClickInside} className="w-6/12 h-fit bg-black">
        <Post post={post} setPosts={setPosts} setShowPostFullScreen={setShowPostFullScreen} />
      </div>
    </div>
  );
}
