"use client";
import React, { useState } from "react";
import UsersList from "./followConnectionUsersList";
interface ProfileFollowersProps {
    followers: number;
    userId: string
}

export default function ProfileFollowers({ followers , userId }: ProfileFollowersProps) {
  const [showUsersList, setShowUsersList] = useState<boolean>(false);
  return (
    <>
    {showUsersList && <UsersList setShowUsersList={setShowUsersList} showFollowers userId={userId} />}
    <div onClick={() => setShowUsersList(true)} className="flex cursor-pointer flex-col items-center justify-center md:flex-row md:gap-2">
      <h2 className="text-sm font-bold md:text-xl">
        {followers}
      </h2>
      <p className="text-md md:text-lg">Followers</p>
    </div>
    </>
  );
}
