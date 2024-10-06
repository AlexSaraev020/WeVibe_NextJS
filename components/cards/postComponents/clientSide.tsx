"use client";
import React, { useState } from "react";
import Tooltip from "@/components/nav/navcomponents/tooltip";
import { FaRegComment } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { GoStarFill } from "react-icons/go";
import { GoStar } from "react-icons/go";

interface PostBottomSideProps {
  comments: [];
  description: string;
  date: string;
}

export default function PostBottomSide({
  comments,
  description,
  date,
}: PostBottomSideProps) {
  const [like, setLike] = useState<number | undefined>(undefined);
  const [dislike, setDislike] = useState<number | undefined>(undefined);
  const [truncate, setTruncate] = useState<boolean>(true);
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
  return (
    <>
      <div className="flex p-2 gap-2 w-full z-10">
        <button onClick={handleLike} className="relative group">
          {like === 1 ? (
            <GoStarFill className="w-10 h-10 fill-sky-500 transition-all duration-500 animate-fadeIn" />
          ) : (
            <GoStar className="w-10 h-10 transition-all duration-500 animate-fadeIn" />
          )}
          <Tooltip text="Vibe" className="z-10"/>
        </button>
        <button className="relative group">
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
          Comments {comments.length}
        </h2>
        <h2> {handleDate(date)}</h2>
      </div>
    </>
  );
}
