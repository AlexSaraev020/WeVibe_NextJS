import React from "react";
import Post from "@/components/cards/post";
import { getPosts } from "@/actions/posts/getPosts";
import { PostType } from "@/types/post/postType";
export default async function Page() {
  const posts = await getPosts();
  return (
    <div className=" w-full md:p-4 flex justify-center items-center">
      <ul className="flex flex-col md:w-6/12 items-center justify-center gap-20 py-20">
        {posts.map((post: PostType) => (
          <li key={post._id}>
            <Post post={post} />
          </li>
        ))}
      </ul>
    </div>
  );
}
