"use client";
import React, { useState } from "react";
import UsersList from "./followConnectionUsersList";
interface ProfileFollowingProps {
  following: number;
  userId: string;
}

export default function ProfileFollowing({
  following,
  userId,
}: ProfileFollowingProps) {
  const [showUsersList, setShowUsersList] = useState<boolean>(false);

  return (
    <>
      {showUsersList && (
        <UsersList
          setShowUsersList={setShowUsersList}
          showFollowing
          userId={userId}
        />
      )}
      <div onClick={() => setShowUsersList(true)} className="flex cursor-pointer flex-col items-center justify-center md:flex-row md:gap-2">
        <h2 className="text-xs font-bold md:text-base">{following}</h2>
        <p className="text-xs md:text-base">Following</p>
      </div>
    </>
  );
}
