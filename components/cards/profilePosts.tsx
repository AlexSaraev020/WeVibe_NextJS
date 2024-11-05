import React from "react";
import Image from "next/image";
import { PostType } from "@/types/post/postType";

interface ProfilePostsProps {
  posts: PostType[];
}

export default function ProfilePosts({ posts }: ProfilePostsProps) {
  return (
      <ul className="grid h-full mb-14 lg:mb-0 grid-cols-2 gap-1 sm:grid-cols-3 w-11/12 md:w-9/12 lg:w-8/12 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent ">
        {posts.length ? (
          posts.map((post: PostType) => (
            <li
              key={post._id}
              className="relative flex w-full items-center justify-center"
            >
              <Image
                className="relative z-10 h-40 w-full object-cover md:h-80"
                src={post.image}
                alt="image"
                priority
                width={1080}
                height={1080}
              />
            </li>
          ))
        ) : (
          <p className="col-span-3 text-center">No posts yet</p>
        )}
      </ul>
  );
}
