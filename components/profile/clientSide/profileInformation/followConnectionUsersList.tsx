"use client";
import { UserType } from "@/types/userTypes/user/userType";
import React, { useCallback, useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import ProfileCard from "@/components/cards/profileCard/profileCard";
import { getAllFollowers } from "@/actions/profile/getAllFollowers";
import { getAllFollowing } from "@/actions/profile/getAllFollowing";
import { useInView } from "react-intersection-observer";

interface UsersListProps {
  setShowUsersList: (showUsersList: boolean) => void;
  userId: string;
  showFollowers?: boolean;
  showFollowing?: boolean;
}
export default function UsersList({
  setShowUsersList,
  showFollowers,
  showFollowing,
  userId,
}: UsersListProps) {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [skip, setSkip] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0 });
  const fetchUsersByType = async ({
    skip,
    limit,
  }: {
    skip: number;
    limit: number;
  }) => {
    if (showFollowers && !showFollowing) {
      return await getAllFollowers({
        setLoading,
        userId,
        skip,
        limit,
        setHasMore,
        setSkip,
      });
    }

    if (showFollowing && !showFollowers) {
      return await getAllFollowing({
        setLoading,
        userId,
        skip,
        limit,
        setHasMore,
        setSkip,
      });
    }
  };

  const loadMoreUsers = useCallback(async () => {
    if (!hasMore) return;
    setLoading(true);

    const newUsers = await fetchUsersByType({ skip, limit: 8 });
    if (newUsers.length < 8) {
      setHasMore(false);
    }
    if (Array.isArray(newUsers)) {
      setUsers((prev) => [...prev, ...newUsers]);
    }
    setLoading(false);
  }, [loading, hasMore, skip]);

  useEffect(() => {
    if (inView) {
      loadMoreUsers();
    }
  }, [inView]);

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
        className="relative flex h-5/6 w-full animate-fadeIn flex-col items-center justify-start gap-6 overflow-auto rounded-t-xl border-t-2 border-postBackground/50 bg-black p-2 py-14 shadow-glow shadow-postBackground/50 transition-all duration-500 scrollbar-none md:w-5/12 md:rounded-xl md:border-2 md:p-6 md:py-14 md:shadow-glow md:shadow-postBackground/50"
      >
        <button
          className="absolute right-2 top-2 rounded-full p-1 md:p-0"
          onClick={() => setShowUsersList(false)}
        >
          <IoClose className="h-7 w-7 cursor-pointer fill-sky-100 transition-all duration-500 hover:scale-105 hover:fill-postBackground/70 md:h-10 md:w-10" />
        </button>
        <ul className="flex h-full w-full flex-col items-center gap-4 overflow-y-auto p-4 scrollbar-none md:w-11/12">
          {users.length > 0 ? (
            users.map((user: UserType) => (
              <ProfileCard
                onClick={() => setShowUsersList(false)}
                key={user._id}
                id={user._id}
                username={user.username}
                image={user.image.url}
              />
            ))
          ) : showFollowers ? (
            <h1 className="text-center text-base text-white">
              This user has 0 followers
            </h1>
          ) : (
            <h1 className="text-center text-base text-white">
              This user follows 0 people
            </h1>
          )}
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
