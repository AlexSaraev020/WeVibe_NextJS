import React from "react";
import Image from "next/image";
import ProfilePosts from "@/components/cards/profilePosts";
import { IoImages } from "react-icons/io5";
import { getUserProfile } from "@/actions/user/getUserProfile";
import ProfileActionsButtons from "@/components/profile/profileActionsButtons";

export default async function Page(props: {
  searchParams: Promise<{ user: string }>;
}) {
  const { user } = await props.searchParams;
  const response = await getUserProfile(user);
  return (
    <div className="flex h-[100dvh] w-full flex-col items-center justify-center">
      {response.status === 200 ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-10 pb-4">
          <div className="flex w-11/12 items-center justify-center gap-1 p-4 md:w-full md:gap-4">
            <Image
              src={response.data.user.image}
              width={400}
              height={400}
              priority
              alt="user"
              className="h-20 w-20 rounded-full md:h-48 md:w-48"
            />
            <div className="flex flex-col">
              <div className="flex items-center justify-center gap-4 md:gap-8">
                <h1 className="max-w-full truncate text-lg font-semibold md:text-3xl">
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
              <p className="text-sm text-white/70">{response.data.user.bio}</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <IoImages className="h-6 w-6 md:h-8 md:w-8" color="white" />
            <h2 className="text-xl font-semibold md:text-2xl">Posts</h2>
          </div>
          <ProfilePosts posts={response.data.user.posts} />
        </div>
      ) : (
        <div>
          <h1>An error occured: 404</h1>
        </div>
      )}
    </div>
  );
}
