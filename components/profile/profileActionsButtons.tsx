"use client";
import { allowFollowing } from "@/actions/profile/allowFollowing";
import { followUser } from "@/actions/user/userActions/follow";
import { unfollowUser } from "@/actions/user/userActions/unfollow";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import EditProfile from "./editProfile";
import { UserType } from "@/types/userTypes/user/userType";

interface Props {
  user: UserType;
}

export default function ProfileActionsButtons({ user }: Props) {
  const [allow, setAllow] = useState<string>("");
  const [edit, setEdit] = useState<boolean>(false);

  useEffect(() => {
    if (user._id) {
      allowFollowing({
        userId: user._id,
        setAllow,
      });
    }
  }, [user._id]);

  const handleFollowUser = async () => {
    if (user._id) {
      const response = await followUser(user._id);
      if (response.status < 300) {
        allowFollowing({
          userId: user._id,
          setAllow,
        });
      }
    }
  };

  const handleUnfollowUser = async () => {
    if (user._id) {
      const response = await unfollowUser(user._id);
      if (response.status < 300) {
        allowFollowing({
          userId: user._id,
          setAllow,
        });
      }
    }
  };

  return (
    <>
      {edit && <EditProfile user={user} setEdit={setEdit} />}
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
        <button
          onClick={() => setEdit(true)}
          className="h-8 w-16 rounded-full bg-slate-600 font-bold text-white shadow-glow shadow-slate-600 transition-all duration-500 hover:scale-105 md:h-10 md:w-24"
        >
          Edit
        </button>
      )}
    </>
  );
}
