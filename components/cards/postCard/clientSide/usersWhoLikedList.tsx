"use client";
import { UserType } from "@/types/userTypes/user/userType";
import React, { useCallback, useEffect, useState } from "react";
import ProfileCard from "../../profileCard/profileCard";
import { seeWhoLiked } from "@/actions/posts/handleLike/seeWhoLiked";
import { AiOutlineLoading } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { getWhoLikedComment } from "@/actions/posts/comments/getWhoLikedComment";
import { getWhoLikedReply } from "@/actions/posts/comments/replies/getWhoLikesReply";
import { useInView } from "react-intersection-observer";

interface UsersListProps {
  setShowUsersList: (showUsersList: boolean) => void;
  _id: string;
  type: "post" | "comment" | "reply";
}
export default function UsersList({
  setShowUsersList,
  _id,
  type,
}: UsersListProps) {
  const [userList, setUserList] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0 });

  useEffect(() => {
    if (inView) {
      loadMoreUsers();
    }
  }, [inView]);

  useEffect(() => {
    setUserList([]);
    setSkip(0);
    setHasMore(true);
  }, []);
  const fetchUsersByType = async ({
    skip,
    limit,
  }: {
    skip: number;
    limit: number;
  }) => {
    switch (type) {
      case "post":
        return await seeWhoLiked({
          skip,
          limit,
          postId: _id,
          setLoading,
          setHasMore,
          setSkip,
        });
      case "comment":
        return await getWhoLikedComment({
          commentId: _id,
          skip,
          limit,
          setLoading,
          setHasMore,
          setSkip,
        });
      case "reply":
        return await getWhoLikedReply({
          replyId: _id,
          skip,
          limit,
          setLoading,
          setHasMore,
          setSkip,
        });
      default:
        return [];
    }
  };

  const loadMoreUsers = useCallback(async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    const newUsers = await fetchUsersByType({ skip, limit: 6 });

    if (Array.isArray(newUsers) && newUsers.length) {
      setUserList((prev) => [...prev, ...newUsers]);
    }
    setLoading(false);
  }, [loading, hasMore, skip]);

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
        className="relative flex h-4/6 w-full animate-fadeIn flex-col items-center justify-start gap-6 overflow-auto rounded-t-xl border-t-2 border-postBackground/50 bg-black p-2 shadow-glow shadow-postBackground/50 transition-all duration-500 scrollbar-none md:w-5/12 md:rounded-xl md:border-2 md:p-6 md:shadow-glow md:shadow-postBackground/50"
      >
        <button
          type="button"
          aria-label="closeUserList"
          title="closeUserList"
          className="absolute right-2 top-2 rounded-full p-1 md:p-0"
          onClick={() => setShowUsersList(false)}
        >
          <IoClose className="h-7 w-7 cursor-pointer fill-sky-100 transition-all duration-500 hover:scale-105 hover:fill-postBackground/70 md:h-10 md:w-10" />
        </button>
        <h2 className="bg-gradient-to-r from-sky-200 via-sky-400 to-sky-200 bg-clip-text text-center text-xl font-extrabold text-transparent md:text-3xl">
          Likes
        </h2>
        <ul className="flex h-full w-full flex-col items-center gap-4 overflow-y-auto p-4 scrollbar-none md:w-11/12">
          {userList.length > 0
            ? userList.map((likedBy: UserType) => (
                <li
                  key={likedBy._id}
                  className="flex h-fit w-full flex-col items-center justify-center px-0 md:px-2"
                >
                  <ProfileCard
                    id={likedBy._id}
                    username={likedBy.username}
                    image={likedBy.image.url}
                  />
                </li>
              ))
            : !hasMore && <p>Nobody liked this post</p>}
          {hasMore && (
            <div
              ref={ref}
              className="flex w-full items-center justify-center pb-24 md:pb-8"
            >
              {loading && <AiOutlineLoading className="h-8 w-8 animate-spin" />}
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
