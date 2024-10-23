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
    <div className="h-screen w-full flex flex-col items-center justify-center">
      {response.status === 200 ? (
        <div className="flex flex-col w-full h-full items-center justify-center gap-10 pb-4">
          <div className="w-full flex items-center justify-center p-4 gap-4">
            <Image
              src={response.data.user.image}
              width={400}
              height={400}
              priority
              alt="user"
              className=" w-28 h-28 md:w-48 md:h-48 rounded-full"
            />
            <div className="flex flex-col">
              <div className="flex gap-8">
                <h1 className=" text-xl md:text-3xl font-semibold">
                  {response.data.user.username}
                </h1>
                <ProfileActionsButtons />
              </div>
              <div className="flex gap-6 mt-4">
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-lg md:text-xl font-bold">
                    {response.data.user.posts ? response.data.user.posts.length : 0}
                  </h2>
                  <p className="text-md md:text-lg">Posts</p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-lg md:text-xl font-bold">
                    {response.data.user.followers
                      ? response.data.user.followers.length
                      : 0}
                  </h2>
                  <p className="text-md md:text-lg">Followers</p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-lg md:text-xl font-bold">
                    {response.data.user.following ? response.data.user.following.length : 0}
                  </h2>
                  <p className="text-md md:text-lg">Following</p>
                </div>
              </div>
              <p className="text-sm text-white/70">{response.data.user.bio}</p>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-4">
              <IoImages className="w-6 h-6 md:w-8 md:h-8" color="white" />
              <h2 className="text-xl md:text-2xl font-semibold">Posts</h2>
            </div>
          </div>
          <div className="w-full flex-grow flex items-center justify-center overflow-y-auto scrollbar-track-transparent scrollbar-thumb-transparent scrollbar-thin">
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
