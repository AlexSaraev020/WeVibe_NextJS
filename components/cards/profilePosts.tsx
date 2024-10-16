import React from "react";
import Image from "next/image";
import { PostType } from "@/types/post/postType";

interface ProfilePostsProps {
  posts: [];
}

export default function ProfilePosts({ posts }: ProfilePostsProps) {
  return (
    <div className="w-11/12 md:w-6/12 align-middle grid grid-cols-3 gap-4 h-full">
      {posts.map((post: PostType) => (
        <Image
          key={post._id}
          className="object-cover h-60"
          src={post.image}
          alt="image"
          priority
          width={1080}
          height={1080}
        />
      ))}
    </div>
  );
}
