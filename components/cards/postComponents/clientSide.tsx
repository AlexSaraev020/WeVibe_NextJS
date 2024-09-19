"use client";
import React, { useState } from "react";
import Tooltip from "@/components/nav/navcomponents/tooltip";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoIosCloseCircle } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";

export default function PostBottomSide() {
  const [like, setLike] = useState<number | undefined>(undefined);
  const [dislike, setDislike] = useState<number | undefined>(undefined);
  const [truncate, setTruncate] = useState<boolean>(true);
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
  const handleDislike = () => {
    if (dislike === undefined && like === undefined) {
      setDislike(1);
    } else if (dislike === undefined && like !== undefined) {
      setLike(undefined);
      setDislike(1);
    } else {
      setDislike(undefined);
    }
  };
  const handleTruncate = () => {
    setTruncate(!truncate);
  };
  return (
    <>
      <div className="flex p-2 gap-2">
        <button onClick={handleLike} className="relative group">
          {like === 1 ? (
            <IoIosCheckmarkCircle className="w-10 h-10" />
          ) : (
            <IoIosCheckmarkCircleOutline className="w-10 h-10" />
          )}
          <Tooltip text="Like" />
        </button>
        <button onClick={handleDislike} className="relative group">
          {dislike === 1 ? (
            <IoIosCloseCircle className="w-10 h-10" />
          ) : (
            <IoIosCloseCircleOutline className="w-10 h-10" />
          )}
          <Tooltip text="Dislike" />
        </button>
        <button className="relative group">
          <FaRegComment className="w-9 h-10 ml-1" />
          <Tooltip text="Comment" />
        </button>
      </div>
      <div className="px-2 w-full flex flex-col gap-1">
        <div
          className={`flex flex-col items-start w-full ${
            truncate ? "truncate" : ""
          }`}
        >
          <p className="text-sm md:text-lg">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aperiam
            voluptates earum atque tenetur veritatis cupiditate nam velit?
            Explicabo, quia atque.
          </p>
          <button
            className="text-xs md:text-md text-zinc-300/90"
            onClick={handleTruncate}
            type="button"
          >
            {truncate ? "Show more" : "Show less"}
          </button>
        </div>
        <h2 className="text-xs md:text-md text-zinc-300/90">Comments 2.5k</h2>
        <h2>24/02/2023</h2>
      </div>
    </>
  );
}
