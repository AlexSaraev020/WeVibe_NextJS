"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CommentType } from "@/types/post/postType";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { GoStar, GoStarFill } from "react-icons/go";
import Long_Text_Truncate from "@/components/text/longTextTruncate";
import { handleLikeComment } from "@/actions/posts/comments/handleLikeComment";
import { getIfLiked } from "@/actions/posts/comments/get_if_liked";

interface CommentProps {
  commentContent: CommentType;
  postId: string;
}
export default function Comment({ commentContent, postId }: CommentProps) {
  const [likes, setLikes] = useState<number>(commentContent.likes.length);
  const [liked, setLiked] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    (async () => {
      await getIfLiked({ commentId: commentContent._id, postId, setLiked });
    })();
  }, []);
  const handleDate = (date: string) => {
    const convertedDate = new Date(date);
    const timeAgo = formatDistanceToNow(convertedDate, { addSuffix: true });
    return timeAgo;
  };
  const handleLike = async () => {
    await handleLikeComment({
      commentId: commentContent._id,
      postId,
      setLikes,
      setLiked,
      liked,
    });
  };
  return (
    <>
    {liked !== undefined ? (
      <div className="flex w-full animate-fadeIn items-start gap-2 rounded-xl border-2 border-black p-2 shadow-zinc-600 transition-all duration-500 hover:border-postBackground/50 hover:shadow-glow-sm hover:shadow-postBackground/50 lg:w-11/12">
      <Link
        className="mt-1 min-w-fit max-w-fit md:mt-0"
        href={`/profile?user=${commentContent.user._id}`}
      >
        <Image
          src={commentContent.user.image}
          alt="Profile"
          className="h-8 w-8 rounded-full object-cover md:h-10 md:w-10"
          width={50}
          height={50}
        />
      </Link>
      <div className="relative flex flex-1 flex-col items-start justify-center">
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
        {commentContent.comment.length > 0 && (
          <Long_Text_Truncate text={commentContent.comment} />
        )}
      </div>
      <div className="flex flex-col items-center justify-center">
        <button className="mt-2" onClick={handleLike} type="button">
          {liked ? (
            <GoStarFill className="h-8 w-7 animate-appear fill-sky-500 transition-all duration-500" />
          ) : (
            <GoStar className="h-8 w-7 animate-appear transition-all duration-500" />
          )}
        </button>
        <h2 className="mt-1 text-xs font-bold">{likes}</h2>
      </div>
    </div>
    ) : (
      <div className="flex w-full animate-pulse items-start gap-2 rounded-xl border-2 p-2 shadow-zinc-600 transition-all duration-500 border-zinc-600 h-14 shadow-glow-sm lg:w-11/12">

      </div>
    )}
    
    </>
  );
}
