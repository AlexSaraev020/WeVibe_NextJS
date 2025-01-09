import React from "react";
import { IoImages } from "react-icons/io5";
import { getUserProfile } from "@/actions/user/getUserProfile";
import ProfileActionsButtons from "@/components/profile/clientSide/profileActionsButtons";
import Long_Text_Truncate from "@/components/text/longTextTruncate";
import ProfileFollowers from "@/components/profile/clientSide/profileInformation/profileFollowers";
import ProfilePictureZoom from "@/components/profile/clientSide/profileInformation/profilePictureZoom";
import ProfileFollowing from "@/components/profile/clientSide/profileInformation/profileFollowing";
import ProfilePosts from "@/components/profile/clientSide/profilePosts";
import DisplayFullUsername from "@/components/profile/clientSide/displayFullUsername";

export default async function Page({
  params,
}: {
  params: Promise<{ user: string }>;
}) {
  const userId = (await params).user;
  const user = await getUserProfile(userId);
  
  return (
    <div className="flex h-[100dvh] w-full flex-col items-center justify-center">
      {user._id ? (
        <div className="mt-10 flex h-full w-full flex-col items-center justify-center gap-2 px-1 pb-4 md:gap-10">
          <div className="mx-auto flex w-auto flex-col items-center justify-center">
            <div
              aria-label="profile"
              className="flex w-full items-center justify-center gap-4 p-4"
            >
              <div aria-label="profile picture" className="w-fit">
                <ProfilePictureZoom userImage={user.image} />
              </div>
              <div className="mt-4 flex flex-col">
                <div className="flex items-center gap-4 md:gap-8">
                  <h1 className="truncate text-xs font-semibold md:text-xl">
                    {user?.username.length > 20
                      ? user.username.slice(0, 20) + "..."
                      : user.username}
                  </h1>
                  {user?.username.length > 20 && (
                    <DisplayFullUsername username={user.username} />
                  )}
                </div>
                <div className="mt-1 flex gap-2 md:mt-4 md:gap-6">
                  <div className="flex flex-col items-center justify-center md:flex-row md:gap-2">
                    <h2 className="text-xs font-bold md:text-base">
                      {user?.posts}
                    </h2>
                    <p className="text-xs md:text-base">Posts</p>
                  </div>
                  <ProfileFollowers
                    userId={userId}
                    followers={user?.followers}
                  />
                  <ProfileFollowing
                    userId={userId}
                    following={user?.following}
                  />
                </div>
              </div>
            </div>
            <div
              aria-label="bio"
              className="mx-5 mt-3 flex w-full max-w-xs flex-col md:mt-0 md:max-w-md"
            >
              {user?.bio.length > 0 && (
                <Long_Text_Truncate
                  className="w-full text-white/50"
                  text={user.bio}
                />
              )}
              <div className="mt-2 flex w-full justify-start">
                <ProfileActionsButtons user={user} />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <IoImages className="h-6 w-6 md:h-8 md:w-8" color="white" />
            <h2 className="text-xl font-semibold md:text-2xl">Posts</h2>
          </div>
          <ProfilePosts userId={userId} />
        </div>
      ) : (
        <div>
          <h1>User not found or an error occurred 404</h1>
        </div>
      )}
    </div>
  );
}
