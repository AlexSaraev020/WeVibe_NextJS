"use client";
import React, { useEffect, useState } from "react";
import Tooltip from "@/components/nav/navcomponents/tooltip";
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
}

export default function PostClientSide({
  postId,
  description,
  date,
}: PostBottomSideProps) {
  const [like, setLike] = useState<number | undefined>(undefined);
  const [dislike, setDislike] = useState<number | undefined>(undefined);
  const [truncate, setTruncate] = useState<boolean>(true);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [addedCommentCounter, setAddedCommentCounter] = useState<number>(0);
  const handleDate = (date: string) => {
    const convertedDate = new Date(date);
    const timeAgo = formatDistanceToNow(convertedDate, { addSuffix: true });
    return timeAgo;
  };
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
  useEffect(() => {
    document.documentElement.style.overflow = showComments ? "hidden" : "auto";
  }, [showComments]);

  useEffect(() => {
    const fetchComments = async () => {
      if (showComments) {
        const comments = await getComments(postId);
        if (!comments) {
          setComments([]);
        }
        setComments(comments);
      }
    };
    fetchComments();
  }, [addedCommentCounter, postId, showComments]);
  console.log(comments);
  return (
    <>
      {showComments && (
        <CommentsSection
          addedCommentCounter={addedCommentCounter}
          setAddedCommentCounter={setAddedCommentCounter}
          postId={postId}
          comments={comments}
          setShowComments={setShowComments}
        />
      )}
      <div className="flex p-2 gap-2 w-full z-10">
        <button onClick={handleLike} className="relative group">
          {like === 1 ? (
            <GoStarFill className="w-10 h-10 fill-sky-500 transition-all duration-500 animate-fadeIn" />
          ) : (
            <GoStar className="w-10 h-10 transition-all duration-500 animate-fadeIn" />
          )}
          <Tooltip text="Vibe" className="z-10" />
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="relative group"
        >
          <FaRegComment className="w-9 h-10 ml-1" />
          <Tooltip text="Comment" className="z-10" />
        </button>
      </div>
      <div className="px-2 w-full flex flex-col gap-1">
        <div
          className={`flex flex-col items-start w-full ${
            truncate ? "truncate" : ""
          }`}
        >
          <p className="text-sm md:text-lg">
            {truncate ? description.slice(0, 200) : description}
          </p>
          {description.length > 200 && (
            <button
              className="text-xs md:text-md text-zinc-300/90"
              onClick={handleTruncate}
              type="button"
            >
              {truncate ? "Show more" : "Show less"}
            </button>
          )}
        </div>
        <h2 className="text-xs md:text-md text-zinc-300/90">
          Comments {[].length}
        </h2>
        <h2> {handleDate(date)}</h2>
      </div>
    </>
  );
}
