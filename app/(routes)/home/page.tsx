import React from "react";
import Post from "@/components/cards/post";
import { getPosts } from "@/actions/posts/getPosts";
import { PostType } from "@/types/post/postType";
import IsUserLoggedin from "@/components/popups/isUserLoggedin";

export const revalidate = 60;
export default async function Page() {
  const posts = await getPosts();
  return (
    <div className="relative flex w-full h-[100dvh] items-center justify-center md:p-4">
      <ul className="flex h-full flex-col items-start justify-start gap-20 py-5 md:w-6/12">
        {posts.length ? (
          posts.map((post: PostType) => (
            <li key={post._id}>
              <Post post={post} />
            </li>
          ))
        ) : (
          <p>No posts yet</p>
        )}
      </ul>
      <IsUserLoggedin />
    </div>
  );
}
