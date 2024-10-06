import React from "react";
import Post from "@/components/cards/post";
import { getPosts } from "@/actions/posts/getPosts";
import { PostType } from "@/types/post/postType";
import Particles from "@/components/background/particles";
export default async function Page() {
  const posts = await getPosts();
  if (!posts) {
    return <div>No posts found</div>;
  }
  return (
    <div className=" w-full md:p-4 flex justify-center items-center relative">
      <Particles
        className="absolute inset-0 z-0"
        quantity={500}
        ease={80}
        color={"#38bdf8"}
        refresh
      />
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
