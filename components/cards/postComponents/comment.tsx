"use client";
import React, { useState } from "react";
import Image from "next/image";
import { CommentType } from "@/types/post/postType";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { GoStar, GoStarFill } from "react-icons/go";

interface CommentProps {
  commentContent: CommentType;
}
export default function Comment({ commentContent }: CommentProps) {
  const [truncate, setTruncate] = useState<boolean>(true);
  const [like, setLike] = useState<number | undefined>(undefined);
  const handleDate = (date: string) => {
    const convertedDate = new Date(date);
    const timeAgo = formatDistanceToNow(convertedDate, { addSuffix: true });
    return timeAgo;
  };
  const handleLike = () => {
    setLike(like === 1 ? undefined : 1);
  };
  return (
    <div className="flex w-full animate-fadeIn justify-between rounded-xl border-2 border-black p-2  shadow-zinc-600 transition-all duration-500 hover:border-postBackground/50 hover:shadow-glow-sm hover:shadow-sky-500 lg:w-11/12">
      <div className="flex gap-2">
        <Link href={`/profile?user=${commentContent.user._id}`}>
          <Image
            src={commentContent.user.image}
            alt="Profile"
            className="h-8 w-8 rounded-full object-cover md:h-10 md:w-10"
            width={50}
            height={50}
          />
        </Link>
        <div className="relative flex flex-col items-start justify-center">
          <div className="flex items-center gap-2">
            <Link
              href={`/profile?user=${commentContent.user._id}`}
              className="text-xs font-bold md:text-lg"
            >
              {commentContent.user.username}
            </Link>
            <h6 className="text-xs font-medium text-zinc-300">
              {handleDate(commentContent.createdAt)}
            </h6>
          </div>
          <p className="max-w-full break-all text-sm font-medium text-zinc-300">
            {truncate && commentContent.comment.length >= 200
              ? commentContent.comment.slice(0, 200) + "..."
              : commentContent.comment}
          </p>

          {commentContent.comment.length >= 200 && (
            <button>
              {truncate ? (
                <p
                  className="text-sm font-medium text-sky-400 transition-all duration-500 hover:scale-105"
                  onClick={() => setTruncate(false)}
                >
                  Read more
                </p>
              ) : (
                <p
                  className="text-sm font-medium text-sky-400 transition-all duration-500 hover:scale-105"
                  onClick={() => setTruncate(true)}
                >
                  Read less
                </p>
              )}
            </button>
          )}
        </div>
      </div>
      <button onClick={handleLike} type="button">
        {like === 1 ? (
          <GoStarFill className="h-8 w-7 animate-appear fill-sky-500 transition-all duration-500" />
        ) : (
          <GoStar className="h-8 w-7 animate-appear transition-all duration-500" />
        )}
      </button>
    </div>
  );
}
