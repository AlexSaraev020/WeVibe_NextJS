import React from "react";
import Image from "next/image";
import Placeholder600x400 from "@/public/placeholders/600-400.png";
import PostBottomSide from "./postComponents/clientSide";
import { PostType } from "@/types/post/postType";

export default function Post({ post }: { post: PostType }) {
  return (
    <div className=" flex flex-col w-full items-start justify-center transition-all duration-500 animate-fadeIn">
      <div className="flex items-center p-2 md:p-0">
        <Image
          src={Placeholder600x400}
          alt="Placeholder"
          className="w-9 h-9 md:w-14 md:h-14 rounded-full p-1 md:p-3"
          width={400}
          height={400}
        />
        <h1 className="text-sm md:text-lg font-bold">{post.createdBy}</h1>
      </div>
      <Image
        src={post.image}
        alt="Placeholder"
        className="w-full h-full object-cover"
        width={1080}
        height={1080}
      />
      <PostBottomSide
        comments={post.comments}
        description={post.description}
        date={post.createdAt.toString()}
      />
    </div>
  );
}
