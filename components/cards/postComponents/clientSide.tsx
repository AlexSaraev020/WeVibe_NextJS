"use client";
import React, { useEffect, useState } from "react";
import { FaRegComment } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { GoStarFill } from "react-icons/go";
import { GoStar } from "react-icons/go";
import CommentsSection from "./comments";
import { getComments } from "@/actions/posts/comments/getComments";
import { CommentType } from "@/types/post/postType";

interface PostBottomSideProps {
  description: string;
  date: string;
  postId: string;
  commentsNumber: number;
}

export default function PostClientSide({
  postId,
  description,
  date,
  commentsNumber,
}: PostBottomSideProps) {
  const [like, setLike] = useState<number | undefined>(undefined);
  const [dislike, setDislike] = useState<number | undefined>(undefined);
  const [truncate, setTruncate] = useState<boolean>(true);
  const [showComments, setShowComments] = useState<boolean>(false);

  const [addedCommentCounter, setAddedCommentCounter] = useState<number>(0);
  const [timeAgo, setTimeAgo] = useState<string | null>(null);

  useEffect(() => {
    const convertedDate = new Date(date);
    if (!isNaN(convertedDate.getTime())) {
      const time = formatDistanceToNow(convertedDate, { addSuffix: true });
      setTimeAgo(time);
    } else {
      console.error("Invalid date:", date);
      setTimeAgo("Invalid date");
    }
  }, [date]);
  useEffect(() => {
    document.documentElement.style.overflow = showComments ? "hidden" : "auto";
  }, [showComments]);
  const handleLike = () => {
    if (like === undefined && dislike === undefined) {
      setLike(1);
    } else if (like === undefined && dislike !== undefined) {
      setDislike(undefined);
      setLike(1);
    } else {
      setLike(undefined);
    }
  };
  const handleTruncate = () => {
    setTruncate(!truncate);
  };

  return (
    <>
      {showComments && (
        <CommentsSection
          addedCommentCounter={addedCommentCounter}
          setAddedCommentCounter={setAddedCommentCounter}
          postId={postId}
          showComments={showComments}
          setShowComments={setShowComments}
        />
      )}
      <div className="flex w-full flex-col pb-4">
        <div className="flex w-full gap-2 p-2">
          <button onClick={handleLike} type="button">
            {like === 1 ? (
              <GoStarFill className="h-8 w-7 animate-fadeIn fill-sky-500 transition-all duration-500" />
            ) : (
              <GoStar className="h-8 w-7 animate-fadeIn transition-all duration-500" />
            )}
          </button>
          <button onClick={() => setShowComments(!showComments)} type="button">
            <FaRegComment className="ml-1 h-8 w-7" />
          </button>
        </div>
        <div className="flex w-full flex-col gap-1 px-2">
          <div
            className={`flex w-full flex-col items-start ${
              truncate ? "truncate" : ""
            }`}
          >
            <p className="text-sm md:text-lg">
              {truncate ? description.slice(0, 200) : description}
            </p>
            {description.length > 200 && (
              <button
                className="md:text-md text-xs text-zinc-300/90"
                onClick={handleTruncate}
                type="button"
              >
                {truncate ? "Show more" : "Show less"}
              </button>
            )}
          </div>
          <h2 className="md:text-md text-xs text-zinc-300/90">
            Comments {commentsNumber}
          </h2>
          <time className="md:text-md text-xs"> {timeAgo}</time>
        </div>
      </div>
    </>
  );
}
