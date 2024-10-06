import React from "react";
import Image from "next/image";
import Placeholder600x400 from "@/public/placeholders/600-400.png";
import PostBottomSide from "./postComponents/clientSide";
import { PostType } from "@/types/post/postType";
import { getUserById } from "@/actions/user/getUser";
import Link from "next/link";

export default async function Post({ post }: { post: PostType }) {
  const user = await getUserById(post.createdBy);
  return (
    <div className=" flex flex-col w-full items-start justify-center transition-all duration-500 animate-fadeIn">
      <div className="flex items-center p-2 md:p-0">
        <Image
          src={Placeholder600x400}
          alt="Placeholder"
          className="w-9 h-9 md:w-14 md:h-14 rounded-full p-1 md:p-3"
          width={400}
          height={400}
        />
        <Link
          href={`/profile` + `?user=${user.user._id}`}
          className="text-sm md:text-lg font-bold"
        >
          {user.user.username}
        </Link>
        <p className="text-sm md:text-lg ml-2 text-gray-400">{post.title}</p>
      </div>
      <div className="w-full relative p-2 md:p-0">
        <Image
          src={post.image}
          priority
          alt="Image"
          className="max-h-[45rem] object-contain z-10 relative"
          width={1080}
          height={1080}
        />
        <Image
          src={post.image}
          priority
          alt="ImageBackground"
          className="max-h-[45rem] absolute inset-0 z-0 blur-xl opacity-35"
          width={1080}
          height={1080}
        />
        <PostBottomSide
          comments={post.comments}
          description={post.description}
          date={post.createdAt.toString()}
        />
      </div>
    </div>
  );
}
