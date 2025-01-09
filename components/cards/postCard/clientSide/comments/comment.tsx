"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CommentType } from "@/types/post/comments/commentsType";
import Link from "next/link";
import { GoStar, GoStarFill } from "react-icons/go";
import Long_Text_Truncate from "@/components/text/longTextTruncate";
import { handleLikeComment } from "@/actions/posts/comments/handleLikeComment";
import { getIfLiked } from "@/actions/posts/comments/getIfLiked";
import RepliesSection from "../replies/repliesSection";
import KebabSection from "../kebabSection";
import UsersList from "../usersWhoLikedList";

interface CommentProps {
  commentContent: CommentType;
  postId: string;
  setComments: (
    updateComments: (prevComments: CommentType[]) => CommentType[],
  ) => void;
}
export default function Comment({
  commentContent,
  postId,
  setComments,
}: CommentProps) {
  const [likes, setLikes] = useState<number>(commentContent.likes);
  const [liked, setLiked] = useState<boolean | undefined>(undefined);
  const [showUsersList, setShowUsersList] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      await getIfLiked({ commentId: commentContent._id, postId, setLiked });
    })();
  }, [commentContent._id, postId]);
  const handleDate = (date: string) => {
    const diff = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000,
    );
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
    if (diff < 31536000) return `${Math.floor(diff / 604800)}w`;
    return `${Math.floor(diff / 31536000)}y`;
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
      {showUsersList && (
        <UsersList
          setShowUsersList={setShowUsersList}
          _id={commentContent._id}
          type="comment"
          showUsersList={showUsersList}
        />
      )}
      {liked !== undefined ? (
        <div className="flex h-fit w-full flex-col items-start rounded-xl border-2 border-black p-2 shadow-zinc-600 transition-all duration-500 hover:border-postBackground/50 hover:shadow-glow-sm hover:shadow-postBackground/50 lg:w-11/12">
          <div className="flex w-full gap-2">
            <Link
              className="mt-1 min-w-fit max-w-fit"
              href={`/profile/${commentContent.user._id}`}
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
                    href={`/profile/${commentContent.user._id}`}
                    className="text-xs font-bold md:text-lg"
                  >
                    {commentContent.user.username.length > 25
                      ? commentContent.user.username.slice(0, 25) + "..."
                      : commentContent.user.username}
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
                  setComments={setComments}
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
                <button
                  onClick={() => setShowUsersList(true)}
                  className="flex h-6 w-full items-start justify-center text-xs font-bold"
                >
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
