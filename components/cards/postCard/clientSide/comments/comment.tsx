"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CommentType } from "@/types/post/comments/commentsType";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { GoKebabHorizontal, GoStar, GoStarFill } from "react-icons/go";
import Long_Text_Truncate from "@/components/text/longTextTruncate";
import { handleLikeComment } from "@/actions/posts/comments/handleLikeComment";
import { getIfLiked } from "@/actions/posts/comments/getIfLiked";
import RepliesSection from "../replies/repliesSection";
import KebabSection from "../kebabSection";

interface CommentProps {
  commentContent: CommentType;
  postId: string;
  setAddedCommentCounter: (
    updateCounter: (prevCounter: number) => number,
  ) => void;
}
export default function Comment({ commentContent, postId, setAddedCommentCounter }: CommentProps) {
  const [likes, setLikes] = useState<number>(commentContent.likes);
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
        <div className="flex h-fit w-full animate-fadeIn flex-col items-start rounded-xl border-2 border-black p-2 shadow-zinc-600 transition-all duration-500 hover:border-postBackground/50 hover:shadow-glow-sm hover:shadow-postBackground/50 lg:w-11/12">
          <div className="flex w-full gap-2">
            <Link
              className="mt-1 min-w-fit max-w-fit"
              href={`/profile?user=${commentContent.user._id}`}
            >
              <Image
                src={commentContent.user.image.url}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover md:h-10 md:w-10"
                width={50}
                height={50}
              />
            </Link>
            <div className="flex w-full items-start justify-between">
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
                  <Long_Text_Truncate
                    className="w-full"
                    text={commentContent.comment}
                  />
                )}
              </div>

              <div className="relative flex h-full w-8 flex-col items-center justify-center">
                <KebabSection
                  postId={postId}
                  setAddedCommentCounter={setAddedCommentCounter}
                  type="comment"
                  commentId={commentContent._id}
                  userId={commentContent.user._id}
                />
                <button
                  className="flex h-6 w-full items-center justify-center"
                  onClick={handleLike}
                  type="button"
                >
                  {liked ? (
                    <GoStarFill className="h-5 w-6 animate-appear fill-sky-500 transition-all duration-500" />
                  ) : (
                    <GoStar className="h-5 w-6 animate-appear transition-all duration-500" />
                  )}
                </button>
                <button className="flex h-6 w-full items-start justify-center text-xs font-bold">
                  {likes}
                </button>
              </div>
            </div>
          </div>
          <RepliesSection commentContent={commentContent} postId={postId} />
        </div>
      ) : (
        <div className="flex h-14 w-full animate-pulse items-start gap-2 rounded-xl border-2 border-zinc-600 p-2 shadow-glow-sm shadow-zinc-600 transition-all duration-500 lg:w-11/12" />
      )}
    </>
  );
}
