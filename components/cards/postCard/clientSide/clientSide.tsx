"use client";
import React, { useEffect, useState } from "react";
import { FaRegComment } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { GoStarFill } from "react-icons/go";
import { GoStar } from "react-icons/go";
import CommentsSection from "./comments/comments";
import { handleLike } from "@/actions/posts/handleLike/handleLike";
import { getLikes } from "@/actions/posts/handleLike/get_If_Liked";
import UsersList from "./usersWhoLikedList";

interface PostBottomSideProps {
  description: string;
  date: string;
  postId: string;
  commentsNumber: number;
  likesNumber: number;
}

export default function PostClientSide({
  postId,
  likesNumber,
  description,
  date,
  commentsNumber,
}: PostBottomSideProps) {
  const [like, setLike] = useState<boolean>(false);
  const [truncate, setTruncate] = useState<boolean>(true);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [addedCommentCounter, setAddedCommentCounter] = useState<number>(0);
  const [timeAgo, setTimeAgo] = useState<string | null>(null);
  const [likes, setLikes] = useState<number>(likesNumber);
  const [showUsersList, setShowUsersList] = useState<boolean>(false);

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
    document.body.style.overflow = showComments ? "hidden" : "auto";
    document.documentElement.style.overflow = showComments ? "hidden" : "auto";
  }, [showComments]);
  useEffect(() => {
    (async () => {
      await getLikes({ postId, setLike, setLikes });
    })();
  }, [postId]);
  const handleLikeOnClick = async () => {
    
    await handleLike({ postId , setLike,setLikes, like });
  };
  const handleTruncate = () => {
    setTruncate(!truncate);
  };

  return (
    <>
      {showUsersList && <UsersList postId={postId} showUsersList={showUsersList} setShowUsersList={setShowUsersList} />}
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
          <button onClick={handleLikeOnClick} type="button">
            {like ? (
              <GoStarFill className="h-8 w-7 animate-fadeIn fill-sky-500 transition-all duration-500" />
            ) : (
              <GoStar className="h-8 w-7 animate-fadeIn transition-all duration-500" />
            )}
          </button>

          <button
            className=""
            onClick={() => setShowComments(!showComments)}
            type="button"
          >
            <FaRegComment className="ml-1 h-8 w-7 animate-fadeIn transition-all duration-500" />
          </button>
        </div>
        <div className="flex w-full flex-col gap-1 px-2">
          <div className="flex w-full flex-col items-start">
            <p className="max-w-full break-all text-sm font-medium text-zinc-300">
              {truncate && description.length >= 200
                ? description.slice(0, 200) + "..."
                : description}
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
          <div onClick={() => setShowUsersList(!showUsersList)} className="w-full cursor-pointer">
            {likes > 0 ? (
              <h2 className="md:text-md text-xs text-zinc-300/90">
                {like
                  ? likes === 1
                    ? "Vibed by you"
                    : likes === 2
                      ? "Vibed by you and 1 more person"
                      : `Vibed by you and other ${likes - 1} people`
                  : `${likes} vibes`}
              </h2>
            ) : (
              <h2 className="md:text-md text-xs text-zinc-300/90">
                No vibes yet
              </h2>
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
