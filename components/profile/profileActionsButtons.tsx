"use client";
import { allowFollowing } from "@/actions/profile/allowFollowing";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ProfileActionsButtons() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("user");
  const [buttonPlaceholder, setButtonPlaceholder] = useState(true);
  const [allowFollow, setAllowFollow] = useState(false);
  const [allowUnfollow, setAllowUnfollow] = useState(false);
  const [allowEdit, setAllowEdit] = useState(false);
  useEffect(() => {
    const checkFollowing = async (userId: string) => {
      const response = await allowFollowing(userId);
      console.log("response", response.allowedActions);
      if (response) {
        setButtonPlaceholder(false);
        setAllowFollow(response.allowedActions.allowFollowing);
        setAllowUnfollow(response.allowedActions.allowUnfollowing);
        setAllowEdit(response.allowedActions.allowEditing);
      }
    };
    if (userId) checkFollowing(userId);
  }, [userId]);
  return (
    <div>
      {buttonPlaceholder && (
        <button className="w-24 h-10 bg-gray-500 rounded-full text-white font-bold">
          Loading...
        </button>
      )}
      {allowFollow && (
        <button className="w-24 h-10 bg-sky-500 rounded-full text-white font-bold">
          Follow
        </button>
      )}
      {allowUnfollow && (
        <button className="w-24 h-10 bg-sky-500 rounded-full text-white font-bold">
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
