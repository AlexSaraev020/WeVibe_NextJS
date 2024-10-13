"use client";
import React, { useState } from "react";
import Image from "next/image";
import { CommentType } from "@/types/post/postType";
import { formatDistanceToNow } from "date-fns";

interface CommentProps {
  commentContent: CommentType;
}
export default function Comment({ commentContent }: CommentProps) {
  const [truncate, setTruncate] = useState<boolean>(true);
  const handleDate = (date: string) => {
    const convertedDate = new Date(date);
    const timeAgo = formatDistanceToNow(convertedDate, { addSuffix: true });
    return timeAgo;
  };
  return (
    <div className="w-full lg:w-11/12 flex border-2 rounded-xl border-zinc-600 hover:border-sky-500 p-2 gap-2 transition-all duration-500 animate-fadeIn shadow-glow-sm shadow-zinc-600 hover:shadow-glow-sm hover:shadow-sky-500">
      <Image
        src={commentContent.user.image}
        alt="Profile"
        className="rounded-full w-8 h-8 md:w-10 md:h-10 object-cover"
        width={50}
        height={50}
      />
      <div className="relative flex flex-col items-start justify-center">
        <div className="flex items-center gap-2">
          <h3 className="text-xs md:text-lg font-bold">
            {commentContent.user.username}
          </h3>
          <h6 className="text-xs font-medium text-zinc-300">
            {handleDate(commentContent.createdAt)}
          </h6>
        </div>
        <p className="text-sm font-medium text-zinc-300 max-w-full break-all">
          {truncate && commentContent.comment.length >= 200
            ? commentContent.comment.slice(0, 200) + "..."
            : commentContent.comment}
        </p>
        {commentContent.comment.length >= 200 && (
          <button>
            {truncate ? (
              <p
                className="text-sm font-medium text-sky-400 hover:scale-105 transition-all duration-500"
                onClick={() => setTruncate(false)}
              >
                Read more
              </p>
            ) : (
              <p
                className="text-sm font-medium text-sky-400 hover:scale-105 transition-all duration-500"
                onClick={() => setTruncate(true)}
              >
                Read less
              </p>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
