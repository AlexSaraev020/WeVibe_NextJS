import React from "react";
import Image from "next/image";
import ProfilePosts from "@/components/cards/profilePosts";
import { IoIosSettings } from "react-icons/io";
import { IoImages } from "react-icons/io5";
import { getUserProfile } from "@/actions/user/getUserProfile";

export default async function Page({
  searchParams,
}: {
  searchParams: { user: string };
}) {
  const response = await getUserProfile(searchParams.user);
  console.log(response);
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      {response ? (
        <div className="flex flex-col w-full h-full items-center justify-center gap-10 pb-4">
          <div className="w-full flex items-center justify-center p-4 gap-4">
            <Image
              src={response.user.image}
              width={400}
              height={400}
              priority
              alt="user"
              className=" w-28 h-28 md:w-48 md:h-48 rounded-full"
            />
            <div className="flex flex-col">
              <div className="flex gap-8">
                <h1 className=" text-xl md:text-3xl font-semibold">
                  {response.user.username}
                </h1>
                <button className="w-32 text-xl md:text-2xl rounded-md border-2 border-sky-500 transition-all duration-500 hover:scale-110 shadow-glow shadow-sky-500 hover:shadow-sky-400 hover:border-sky-400 hover:text-sky-400">
                  Follow
                </button>
              </div>
              <div className="flex gap-6 mt-4">
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-lg md:text-xl font-bold">
                    {response.user.posts ? response.user.posts.length : 0}
                  </h2>
                  <p className="text-md md:text-lg">Posts</p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-lg md:text-xl font-bold">
                    {response.user.followers
                      ? response.user.followers.length
                      : 0}
                  </h2>
                  <p className="text-md md:text-lg">Followers</p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-lg md:text-xl font-bold">{response.user.follows ? response.user.follows.length : 0}</h2>
                  <p className="text-md md:text-lg">Follows</p>
                </div>
              </div>
              <p className="text-sm text-white/70">{response.user.bio}</p>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-4">
              <IoImages className="w-6 h-6 md:w-8 md:h-8" color="white" />
              <h2 className="text-xl md:text-2xl font-semibold">Posts</h2>
            </div>
          </div>
          <div className="w-full flex-grow flex items-center justify-center overflow-y-auto scrollbar-track-transparent scrollbar-thumb-transparent scrollbar-thin">
            <ProfilePosts posts={response.user.posts} />
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
