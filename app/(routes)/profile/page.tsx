import React from "react";
import ProfilePosts from "@/components/cards/profilePosts";
import { IoImages } from "react-icons/io5";
import { getUserProfile } from "@/actions/user/getUserProfile";
import ProfileActionsButtons from "@/components/profile/profileActionsButtons";
import Long_Text_Truncate from "@/components/text/longTextTruncate";
import ProfilePictureZoom from "./profilePictureZoom";

export default async function Page(props: {
  searchParams: Promise<{ user: string }>;
}) {
  const { user } = await props.searchParams;
  const response = await getUserProfile(user);
  return (
    <div className="flex h-[100dvh] w-full flex-col items-center justify-center">
      {response.status === 200 ? (
        <div className="mt-10 flex h-full w-11/12 flex-col items-center justify-center gap-10 pb-4 md:w-full">
          <div className="flex w-full items-start justify-center gap-4 p-4 md:w-4/12">
            <div className="w-fit">
              <ProfilePictureZoom image={response.data.user.image} />
            </div>
            <div className="mt-4 flex flex-col">
              <div className="flex items-center gap-4 md:gap-8">
                <h1 className="truncate text-lg font-semibold md:text-3xl">
                  {response.data.user.username}
                </h1>
                <ProfileActionsButtons user={response.data.user} />
              </div>
              <div className="mt-1 flex gap-2 md:mt-4 md:gap-6">
                <div className="flex flex-col items-center justify-center md:flex-row md:gap-2">
                  <h2 className="text-sm font-bold md:text-xl">
                    {response.data.user.posts
                      ? response.data.user.posts.length
                      : 0}
                  </h2>
                  <p className="text-md md:text-lg">Posts</p>
                </div>
                <div className="flex flex-col items-center justify-center md:flex-row md:gap-2">
                  <h2 className="text-sm font-bold md:text-xl">
                    {response.data.user.followers
                      ? response.data.user.followers.length
                      : 0}
                  </h2>
                  <p className="text-md md:text-lg">Followers</p>
                </div>
                <div className="flex flex-col items-center justify-center md:flex-row md:gap-2">
                  <h2 className="text-sm font-bold md:text-xl">
                    {response.data.user.following
                      ? response.data.user.following.length
                      : 0}
                  </h2>
                  <p className="text-md md:text-lg">Following</p>
                </div>
              </div>
              {response.data.user.bio.length > 0 && (
                <Long_Text_Truncate
                  className="hidden text-white/50 md:block"
                  text={response.data.user.bio}
                />
              )}
            </div>
          </div>

          {response.data.user.bio.length > 0 && (
            <Long_Text_Truncate
              className="-mt-10 block w-11/12 text-white/20 sm:w-8/12 md:hidden"
              text={response.data.user.bio}
            />
          )}
          <div className="flex items-center justify-center gap-4">
            <IoImages className="h-6 w-6 md:h-8 md:w-8" color="white" />
            <h2 className="text-xl font-semibold md:text-2xl">Posts</h2>
          </div>
          <ProfilePosts posts={response.data.user.posts} />
        </div>
      ) : (
        <div>
          <h1>User not found or an error occurred 404</h1>
        </div>
      )}
    </div>
  );
}
