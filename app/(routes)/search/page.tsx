import { getUsersByQuery } from "@/actions/user/getUser";
import { UserType } from "@/types/userTypes/user/userType";
import React from "react";
import Image from "next/image";
import ProfilePlaceholder from "@/public/placeholders/profilePlaceholder.png";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const response = await getUsersByQuery(searchParams.q);

  return (
    <div className=" flex-1 w-full flex items-start justify-center">
      <ul className="flex flex-col w-full items-center justify-start gap-10 overflow-auto py-32">
        {response.users.length > 0 ? (
          response.users.map((user: UserType) => (
            <li
              className="border-2 border-zinc-400 shadow-glow shadow-white/30 p-3 flex flex-col w-4/12 rounded-lg transition-all duration-500 hover:scale-105 animate-fadeIn"
              key={user._id}
            >
              <Link
                href={`/profile` + `?user=${user.username}`}
                className="flex items-center gap-1"
              >
                <Image
                  src={ProfilePlaceholder}
                  alt="user"
                  priority
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
                <h2 className="text-xl">{user.username}</h2>
              </Link>
              <p className="truncate px-2 text-zinc-400/70 w-11/12">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Temporibus, sapiente. Alias neque ducimus provident accusantium
                aliquam, non voluptatibus officiis repellendus.
              </p>
            </li>
          ))
        ) : (
          <div>No users found</div>
        )}
      </ul>
    </div>
  );
}
