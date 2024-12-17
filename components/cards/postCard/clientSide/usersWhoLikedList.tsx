"use client";
import { UserType } from "@/types/userTypes/user/userType";
import React, { useEffect, useState } from "react";
import ProfileCard from "../../profileCard/profileCard";
import { seeWhoLiked } from "@/actions/posts/handleLike/seeWhoLiked";
import { AiOutlineLoading } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { getWhoLikedComment } from "@/actions/posts/comments/getWhoLikedComment";
import { getWhoLikedReply } from "@/actions/posts/comments/replies/getWhoLikesReply";

interface UsersListProps {
  setShowUsersList: (showUsersList: boolean) => void;
  showUsersList: boolean;
  _id: string;
  type: "post" | "comment" | "reply";
}
export default function UsersList({
  setShowUsersList,
  _id,
  type,
}: UsersListProps) {
  const [userList, setUserList] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    (async () => {
      switch (type) {
        case "post":
          await seeWhoLiked({ postId: _id, setUserList, setLoading });
          break;
        case "comment":
          await getWhoLikedComment({ commentId: _id, setUserList, setLoading });
          break;
        case "reply":
          await getWhoLikedReply({ replyId: _id, setUserList, setLoading });
          break;
      }
    })();
  }, [_id]);

  const handleClickOutside = () => {
    setShowUsersList(false);
  };

  const handleClickInside = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={handleClickOutside}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 md:items-center"
    >
      <div
        onClick={handleClickInside}
        className="relative flex h-4/6 w-full animate-fadeIn flex-col items-center justify-start gap-6 overflow-auto rounded-t-xl border-t-2 border-postBackground/50 bg-black p-2 py-14 shadow-glow shadow-postBackground/50 transition-all duration-500 scrollbar-none md:w-5/12 md:rounded-xl md:border-2 md:p-6 md:py-14 md:shadow-glow md:shadow-postBackground/50"
      >
        <button
          className="absolute right-2 top-2 rounded-full p-1 md:p-0"
          onClick={() => setShowUsersList(false)}
        >
          <IoClose className="h-7 w-7 cursor-pointer fill-sky-100 transition-all duration-500 hover:scale-105 hover:fill-postBackground/70 md:h-10 md:w-10" />
        </button>
        <h2 className="bg-gradient-to-r from-sky-200 via-sky-400 to-sky-200 bg-clip-text text-center text-xl font-extrabold text-transparent md:text-3xl">
          Likes
        </h2>
        <ul className="flex h-full w-full flex-col items-center gap-4 overflow-y-auto p-4 scrollbar-none md:w-11/12">
          {userList.length > 0 ? (
            userList.map((likedBy: UserType) => (
              <ProfileCard
                key={likedBy._id}
                id={likedBy._id}
                username={likedBy.username}
                image={likedBy.image.url}
              />
            ))
          ) : loading ? (
            <AiOutlineLoading className="animate-spin" />
          ) : (
            <p>Nobody liked this post</p>
          )}
        </ul>
      </div>
    </div>
  );
}
