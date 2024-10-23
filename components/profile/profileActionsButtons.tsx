"use client";
import { allowFollowing } from "@/actions/profile/allowFollowing";
import { followUser } from "@/actions/user/userActions/follow";
import { unfollowUser } from "@/actions/user/userActions/unfollow";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ProfileActionsButtons() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("user");
  const [buttonPlaceholder, setButtonPlaceholder] = useState<boolean>(true);
  const [allowFollow, setAllowFollow] = useState<boolean>(false);
  const [allowUnfollow, setAllowUnfollow] = useState<boolean>(false);
  const [allowEdit, setAllowEdit] = useState<boolean>(false);

  useEffect(() => {
    if (userId) {
      allowFollowing({
        userId,
        setButtonPlaceholder,
        setAllowFollow,
        setAllowUnfollow,
        setAllowEdit,
      });
    }
  }, [userId]);

  const handleFollowUser = async () => {
    if (userId) {
      const response = await followUser(userId);
      if (response.status < 300) {
        allowFollowing({
          userId,
          setButtonPlaceholder,
          setAllowFollow,
          setAllowUnfollow,
          setAllowEdit,
        });
      }
      console.log(response);
    }
  };

  const handleUnfollowUser = async () => {
    if (userId) {
      const response = await unfollowUser(userId);
      if (response.status < 300) {
        allowFollowing({
          userId,
          setButtonPlaceholder,
          setAllowFollow,
          setAllowUnfollow,
          setAllowEdit,
        });
      }
      console.log(response);
    }
  };

  return (
    <div>
      {buttonPlaceholder && (
        <button className="w-24 h-10 bg-gray-500 rounded-full text-white font-bold">
          Loading...
        </button>
      )}
      {allowFollow && (
        <button
          onClick={handleFollowUser}
          className="w-24 h-10 bg-sky-500 rounded-full text-white font-bold"
        >
          Follow
        </button>
      )}
      {allowUnfollow && (
        <button
          onClick={handleUnfollowUser}
          className="w-24 h-10 bg-sky-500 rounded-full text-white font-bold"
        >
          Unfollow
        </button>
      )}
      {allowEdit && (
        <button className="w-24 h-10 bg-gray-500 rounded-full text-white font-bold">
          Edit
        </button>
      )}
    </div>
  );
}
