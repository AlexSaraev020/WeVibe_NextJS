import React from "react";
import Placeholder600x400 from "@/public/placeholders/600-400.png";
import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface ProfileCardProps {
  id: string;
  username: string;
  image: string;
  bio?: string;
  className?: string;
  onClick?: () => void;
}

export default function ProfileCard({
  id,
  onClick,
  className,
  username,
  image,
  bio,
}: ProfileCardProps) {
  return (
    <Link
      onClick={onClick}
      href={`/profile/${id}`}
      className={`${className} relative flex w-full animate-fadeIn flex-col rounded-lg border-2 border-transparent p-3 shadow-glow-sm shadow-postBackground/50 transition-all delay-100 duration-500 hover:scale-105 hover:border-postBackground/50 hover:shadow-glow hover:shadow-postBackground/50`}
    >
      <div className="flex items-center w-full gap-2">
        <Image
          src={image || Placeholder600x400}
          alt="user"
          priority
          width={40}
          height={40}
          className="h-8 w-8 rounded-full object-cover md:h-12 md:w-12"
        />

        <div className="flex flex-1 flex-col justify-center">
          <h2 className="text-sm md:text-base">{username.length > 30 ? username.slice(0, 30) + "..." : username}</h2>
          <p
            className={twMerge(
              "w-11/12 text-xs md:text-sm text-zinc-400/70",
              bio && bio?.length > 20 ? "line-clamp-1" : "",
            )}
          >
            {bio && bio?.length > 30 ? bio.slice(0, 30) + "..." : bio}
          </p>
        </div>
      </div>
    </Link>
  );
}
