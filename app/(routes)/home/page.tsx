import React from "react";
import Post from "@/components/cards/post";
import { getPosts } from "@/actions/posts/getPosts";
import { PostType } from "@/types/post/postType";
import IsUserLoggedinPromptNotification from "@/components/popups/isUserLoggedin";

export const revalidate = 60;
export default async function Page() {
  const posts = await getPosts();
  return (
    <div className="flex h-[100dvh] w-full items-center justify-center md:p-4 transition-all duration-500">
      <ul className="flex h-full flex-col items-start justify-start py-5 md:w-6/12">
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

      <IsUserLoggedinPromptNotification />
    </div>
  );
}
