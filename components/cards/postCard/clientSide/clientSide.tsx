"use client";
import React, { useEffect, useState } from "react";
import { FaRegComment } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { GoStarFill } from "react-icons/go";
import { GoStar } from "react-icons/go";
import CommentsSection from "./comments/comments";
import { handleLike } from "@/actions/posts/handleLike/handleLike";
import UsersList from "./usersWhoLikedList";

interface PostBottomSideProps {
  description: string;
  date: string;
  postId: string;
  commentsNumber: number;
  setLikes: (updateLikes: (prevLikes: number) => number) => void;
  like: boolean | undefined;
  likes: number;
  setLike: (like: boolean) => void;
}

export default function PostClientSide({
  postId,
  description,
  date,
  like,
  likes,
  setLikes,
  setLike,
  commentsNumber,
}: PostBottomSideProps) {
  const [truncate, setTruncate] = useState<boolean>(true);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [timeAgo, setTimeAgo] = useState<string | null>(null);
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

  const handleLikeOnClick = async () => {
    await handleLike({ postId, setLike, setLikes, like });
  };
  const handleTruncate = () => {
    setTruncate(!truncate);
  };

  return (
    <>
      {showUsersList && (
        <UsersList
          type="post"
          _id={postId}
          showUsersList={showUsersList}
          setShowUsersList={setShowUsersList}
        />
      )}
      {showComments && (
        <CommentsSection
          postId={postId}
          setShowComments={setShowComments}
        />
      )}
      <div className="flex w-full flex-col pb-4">
        <div className="flex w-full gap-2 p-2">
          <button onClick={handleLikeOnClick} type="button" aria-label="likeHandler" id="like">
            {like ? (
              <GoStarFill className="h-8 w-7 animate-fadeIn fill-sky-500 transition-all duration-500" />
            ) : (
              <GoStar className="h-8 w-7 animate-fadeIn transition-all duration-500" />
            )}
          </button>

          <button
            id="showComments"
            aria-label="showComments"
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
                id="showMoreTextDescriptionText"
                aria-label="showMoreDecriptionText"
                className="md:text-md text-xs text-zinc-300/90"
                onClick={handleTruncate}
                type="button"
              >
                {truncate ? "Show more" : "Show less"}
              </button>
            )}
          </div>
          <div
            onClick={() => setShowUsersList(!showUsersList)}
            className="w-full cursor-pointer"
          >
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
