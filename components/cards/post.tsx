import React from "react";
import Image from "next/image";
import PostClientSide from "./postComponents/clientSide";
import { PostType } from "@/types/post/postType";
import Link from "next/link";
import KebabSection from "./postComponents/kebabSection";

export default function Post({ post }: { post: PostType }) {
  return (
    <div className="relative mb-20 flex w-full flex-col items-start justify-center rounded-xl from-postBackground/10 via-postBackground/40 to-postBackground/10 px-0 transition-all duration-500 md:bg-gradient-to-b md:px-2 md:shadow-glow md:shadow-postBackground/50">
      <KebabSection imageUrl={post.image} postId={post._id} userId={post.createdBy._id} />
      <div className="flex w-full animate-fadeIn items-center py-2 transition-all duration-500 md:p-0">
        <Link
          href={`/profile?user=${post.createdBy._id}`}
          className="flex items-center justify-center text-sm font-bold md:text-lg"
        >
          <Image
            src={post.createdBy.image}
            alt={post.createdBy.username}
            className="h-9 w-9 rounded-full p-1 md:h-14 md:w-14 object-cover md:p-3"
            width={400}
            height={400}
          />

          {post.createdBy.username}
        </Link>
        <p className="ml-2 text-sm text-gray-400 md:text-lg">{post.title}</p>
      </div>
      <div className="relative w-full animate-fadeIn bg-zinc-950 transition-all duration-500 md:p-0">
        <Image
          src={post.image}
          priority
          alt="Image"
          className="relative max-h-[20rem] object-contain md:max-h-[40rem]"
          width={1080}
          height={1080}
        />
        <Image
          src={post.image}
          alt="ImageBackground"
          className="absolute inset-0 -z-10 max-h-[20rem] opacity-20 blur-sm md:max-h-[40rem]"
          width={1080}
          height={1080}
        />
      </div>
      <PostClientSide
        postId={post._id}
        description={post.description}
        date={post.createdAt.toString()}
        commentsNumber={post.comments.length}
        likesNumber={post.likes && post.likes.length}
      />
    </div>
  );
}
