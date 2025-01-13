"use client";
import { allowFollowing } from "@/actions/profile/following/allowFollowing";
import { followUser } from "@/actions/profile/following/follow";
import { unfollowUser } from "@/actions/profile/following/unfollow";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import EditProfile from "./editPorifle/editProfile";
import { AllowTypes, UserType } from "@/types/userTypes/user/userType";
import ShinyButton from "@/components/buttons/shinyButton";
import { IoSettingsOutline } from "react-icons/io5";


interface Props {
  user: UserType;
}

export default function ProfileActionsButtons({ user }: Props) {
  const [allow, setAllow] = useState<AllowTypes>({ edit: false, follow: false, unfollow: false });
  const [edit, setEdit] = useState<boolean>(false);
  const router = useRouter();

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
      const response = await followUser({ query: user._id , router });
      if (response.status < 300) {
        router.refresh();
        allowFollowing({
          userId: user._id,
          setAllow,
        });
      }
    }
  };

  const handleUnfollowUser = async () => {
    if (user._id) {
      const response = await unfollowUser({ query: user._id , router });
      if (response.status < 300) {
        router.refresh();
        allowFollowing({
          userId: user._id,
          setAllow,
        });
      }
    }
  };

  return (
    <>
      {edit && <EditProfile edit={edit} user={user} setEdit={setEdit} />}
      {!allow.edit && !allow.follow && !allow.unfollow  && (
        <AiOutlineLoading className="h-6 w-6 animate-spin text-postBackground" />
      )}
      {allow.follow && (
        <ShinyButton
          id="followUserButton"
          ariaLabel="FollowUserButton"
          type="button"
          onClick={handleFollowUser}
          bottomLineCollor="bg-gradient-to-r from-sky-500/0 via-postBackground/50 to-sky-500/0"
          topLineColor="bg-gradient-to-r from-sky-500/0 via-postBackground/50 to-sky-500/0"
          className="w-16 bg-postBackground/20 text-xs font-semibold text-sky-200 hover:shadow-lg hover:shadow-postBackground/30 md:w-24 md:text-lg"
          text="Follow"
          background="bg-sky-900 py-2 md:py-1"
        />
      )}
      {allow.unfollow && (
        <ShinyButton
          id="unfollowUserButton"
          ariaLabel="UnfollowUserButton"
          onClick={handleUnfollowUser}
          bottomLineCollor="bg-gradient-to-r from-sky-500/0 via-neutral-500 to-sky-500/0"
          topLineColor="bg-gradient-to-r from-sky-500/0 via-neutral-500 to-sky-500/0"
          className="w-16 bg-neutral-700 text-xs font-semibold text-zinc-400 hover:shadow-lg hover:shadow-neutral-700 md:w-24 md:text-lg"
          text="Unfollow"
          type="button"
          background="bg-neutral-800 py-2 md:py-1"
        />
      )}
      {allow.edit&& (
        <button
          id="editUserButton"
          aria-label="EditUserButton"
          onClick={() => (edit === false ? setEdit(true) : setEdit(true))}
          className="w-fit"
          type="button"
        >
          <IoSettingsOutline className="h-6 w-6" />
        </button>
      )}
    </>
  );
}
