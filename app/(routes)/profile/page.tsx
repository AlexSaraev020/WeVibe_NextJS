import React from "react";
import Image from "next/image";
import ProfilePosts from "@/components/cards/profilePosts";
import { IoImages } from "react-icons/io5";
import { getUserProfile } from "@/actions/user/getUserProfile";
import ProfileActionsButtons from "@/components/profile/profileActionsButtons";

export default async function Page({
  searchParams,
}: {
  searchParams: { user: string };
}) {
  const response = await getUserProfile(searchParams.user);
  console.log(response);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      {response.status === 200 ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-10 pb-4">
          <div className="flex w-full items-center justify-center gap-4 p-4">
            <Image
              src={response.data.user.image}
              width={400}
              height={400}
              priority
              alt="user"
              className="h-28 w-28 rounded-full md:h-48 md:w-48"
            />
            <div className="flex flex-col">
              <div className="flex gap-8">
                <h1 className="text-xl font-semibold md:text-3xl">
                  {response.data.user.username}
                </h1>
                <ProfileActionsButtons />
              </div>
              <div className="mt-4 flex gap-6">
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-lg font-bold md:text-xl">
                    {response.data.user.posts
                      ? response.data.user.posts.length
                      : 0}
                  </h2>
                  <p className="text-md md:text-lg">Posts</p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-lg font-bold md:text-xl">
                    {response.data.user.followers
                      ? response.data.user.followers.length
                      : 0}
                  </h2>
                  <p className="text-md md:text-lg">Followers</p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-lg font-bold md:text-xl">
                    {response.data.user.following
                      ? response.data.user.following.length
                      : 0}
                  </h2>
                  <p className="text-md md:text-lg">Following</p>
                </div>
              </div>
              <p className="text-sm text-white/70">{response.data.user.bio}</p>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-4">
              <IoImages className="h-6 w-6 md:h-8 md:w-8" color="white" />
              <h2 className="text-xl font-semibold md:text-2xl">Posts</h2>
            </div>
          </div>
          <div className="flex w-full flex-grow items-center justify-center overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent">
            <ProfilePosts posts={response.data.user.posts} />
          </div>
        </div>
      ) : (
        <div>
          <h1>404</h1>
        </div>
      )}
    </div>
  );
}
