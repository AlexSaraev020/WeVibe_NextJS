"use client";
import { allowFollowing } from "@/actions/profile/allowFollowing";
import { followUser } from "@/actions/user/userActions/follow";
import { unfollowUser } from "@/actions/user/userActions/unfollow";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";

interface Props {
  userId: string;
}

export default function ProfileActionsButtons({userId}: Props) {
  const [allow, setAllow] = useState<string>("");

  useEffect(() => {
    if (userId) {
      allowFollowing({
        userId,
        setAllow,
      });
    }
  }, [userId]);

  const handleFollowUser = async () => {
    if (userId) {
      const response = await followUser(userId);
      if (response.status < 300) {
        allowFollowing({
          userId,
          setAllow,
        });
      }
    }
  };

  const handleUnfollowUser = async () => {
    if (userId) {
      const response = await unfollowUser(userId);
      if (response.status < 300) {
        allowFollowing({
          userId,
          setAllow,
        });
      }
    }
  };

  return (
    <div>
      {allow === "" && (
        <AiOutlineLoading className="h-6 w-6 animate-spin text-postBackground" />
      )}
      {allow === "follow" && (
        <button
          onClick={handleFollowUser}
          className="h-8 w-16 rounded-full bg-postBackground/50 font-bold text-white shadow-glow shadow-postBackground/50 transition-all duration-500 hover:scale-105 md:h-10 md:w-24"
        >
          Follow
        </button>
      )}
      {allow === "unfollow" && (
        <button
          onClick={handleUnfollowUser}
          className="h-8 w-16 rounded-full bg-postBackground/50 font-bold text-white shadow-glow shadow-postBackground/50 transition-all duration-500 hover:scale-105 md:h-10 md:w-24"
        >
          Unfollow
        </button>
      )}
      {allow === "edit" && (
        <button className="h-8 w-16 rounded-full bg-slate-600 font-bold text-white shadow-glow shadow-slate-600 transition-all duration-500 hover:scale-105 md:h-10 md:w-24">
          Edit
        </button>
      )}
    </div>
  );
}
