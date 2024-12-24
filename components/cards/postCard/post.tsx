"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import PostClientSide from "./clientSide/clientSide";
import { PostType } from "@/types/post/postType";
import Link from "next/link";
import KebabSection from "./clientSide/kebabSection";
import { getLikes } from "@/actions/posts/handleLike/get_If_Liked";

interface PostProps {
  post: PostType;
  setPosts: (updatePosts: (prevPosts: PostType[]) => PostType[]) => void;
}

export default function Post({ post, setPosts }: PostProps) {
  const [like, setLike] = useState<boolean | undefined>(undefined);
  const [likes, setLikes] = useState<number>(post.likes);

  useEffect(() => {
    (async () => {
      await getLikes({ postId: post._id, setLike, setLikes });
    })();
  }, [post._id]);
  return (
    <>
      {like !== undefined ? (
        <div className="relative mb-4 flex w-full flex-col items-start justify-center rounded-xl from-postBackground/10 via-postBackground/40 to-postBackground/10 px-0 transition-all duration-500 md:mb-10 md:bg-gradient-to-b md:px-2 md:shadow-glow md:shadow-postBackground/50 xl:mb-20">
          <div className="flex w-full justify-between">
            <div className="flex w-fit animate-fadeIn items-center py-2 transition-all duration-500 md:p-0">
              <Link
                href={`/profile?user=${post.createdBy._id}`}
                className="flex items-center justify-center text-sm font-bold md:text-lg"
              >
                <Image
                  src={post.createdBy.image.url}
                  alt={post.createdBy.username}
                  className="h-9 w-9 rounded-full object-cover p-1 md:h-14 md:w-14 md:p-3"
                  width={400}
                  height={400}
                />

                {post.createdBy.username}
              </Link>
              <p className="ml-2 text-sm text-gray-400 md:text-lg">
                {post.title}
              </p>
            </div>
            <KebabSection
              type="post"
              setPosts={setPosts}
              image={post.image}
              postId={post._id}
              userId={post.createdBy._id}
            />
          </div>
          <div className="relative rounded-xl w-full animate-fadeIn bg-zinc-950 transition-all duration-500 md:p-0">
            <Image
              src={post.image.url}
              priority
              alt="Image"
              className="relative max-h-[20rem]  rounded-xl object-contain md:max-h-[40rem]"
              width={1080}
              height={1080}
            />
            <Image
              src={post.image.url}
              priority
              alt="ImageBackground"
              className="absolute inset-0 -z-10 max-h-[20rem]  rounded-xl opacity-20 blur-sm md:max-h-[40rem]"
              width={1080}
              height={1080}
            />
          </div>
          <PostClientSide
            setLike={setLike}
            likes={likes}
            setLikes={setLikes}
            like={like}
            postId={post._id}
            description={post.description}
            date={post.createdAt.toString()}
            commentsNumber={post.comments.length}
          />
        </div>
      ) : (
        <div className="relative h-[40rem] mb-4 flex w-full flex-col items-start justify-center rounded-xl from-postBackground/10 via-postBackground/40 to-postBackground/10 px-0 transition-all duration-500 md:mb-10 md:bg-gradient-to-b md:px-2 md:shadow-glow md:shadow-postBackground/50 xl:mb-20">
          <div className="flex w-full justify-between">
            <div className="flex w-fit items-center py-2 transition-all duration-500 md:p-2">
              <div className="h-9 w-9 animate-pulse rounded-full bg-gray-300/20 md:h-12 md:w-12"></div>
              <div className="ml-2 h-4 w-20 animate-pulse bg-gray-300/20 rounded-full md:h-6 md:w-32"></div>
            </div>
            <div className="h-6 w-6 animate-pulse rounded-full bg-gray-300/20 mt-2 md:h-8 md:w-8"></div>
          </div>
          <div className="relative h-full w-full animate-pulse bg-gray-300/20 rounded-xl transition-all duration-500 md:p-0">
          </div>
          <div className="w-full px-2 py-4">
            <div className="mb-2 h-4 w-32 animate-pulse bg-gray-300/20 md:h-6 md:w-40 rounded-full"></div>
            <div className="h-4 w-full animate-pulse bg-gray-300/20 rounded-full md:h-6"></div>
          </div>
        </div>
      )}
    </>
  );
}
