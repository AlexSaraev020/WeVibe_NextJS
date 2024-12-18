import React from "react";
import { IoImages } from "react-icons/io5";
import { getUserProfile } from "@/actions/user/getUserProfile";
import ProfileActionsButtons from "@/components/profile/clientSide/profileActionsButtons";
import Long_Text_Truncate from "@/components/text/longTextTruncate";
import ProfileFollowers from "@/components/profile/clientSide/profileInformation/profileFollowers";
import ProfilePictureZoom from "@/components/profile/clientSide/profileInformation/profilePictureZoom";
import ProfileFollowing from "@/components/profile/clientSide/profileInformation/profileFollowing";
import ProfilePosts from "@/components/profile/clientSide/profilePosts";
import { UserType } from "@/types/userTypes/user/userType";

export default async function Page(props: {
  searchParams: Promise<{ user: string }>;
}) {
  const searchParams = await props.searchParams;
  const userId = searchParams.user;
  const response = await getUserProfile(userId);
  const user = response.data.user as UserType
  return (
    <div className="flex h-[100dvh] w-full flex-col items-center justify-center">
      {user ? (
        <div className="mt-10 flex h-full w-11/12 flex-col items-center justify-center gap-10 pb-4 md:w-full">
          <div className="flex w-full items-start justify-center gap-4 p-4 md:w-4/12">
            <div className="w-fit">
              <ProfilePictureZoom image={user.image.url} />
            </div>
            <div className="mt-4 flex flex-col">
              <div className="flex items-center gap-4 md:gap-8">
                <h1 className="truncate text-lg font-semibold md:text-3xl">
                  {user.username}
                </h1>
                <ProfileActionsButtons user={user} />
              </div>
              <div className="mt-1 flex gap-2 md:mt-4 md:gap-6">
                <div className="flex flex-col items-center justify-center md:flex-row md:gap-2">
                  <h2 className="text-sm font-bold md:text-xl">
                    {user.posts}
                  </h2>
                  <p className="text-md md:text-lg">Posts</p>
                </div>
                <ProfileFollowers
                  userId={userId}
                  followers={user.followers}
                />
                <ProfileFollowing
                  userId={userId}
                  following={user.following}
                />
              </div>
              {user.bio.length > 0 && (
                <Long_Text_Truncate
                  className="hidden text-white/50 md:block"
                  text={user.bio}
                />
              )}
            </div>
          </div>

          {user.bio.length > 0 && (
            <Long_Text_Truncate
              className="-mt-10 block w-11/12 text-white/20 sm:w-8/12 md:hidden"
              text={user.bio}
            />
          )}
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
