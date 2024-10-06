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
              className="relative p-3 flex flex-col w-4/12 hover:shadow-glow rounded-lg hover:shadow-sky-500 border-2 border-white/20 hover:border-sky-500 delay-100 transition-all duration-500 hover:scale-105 animate-fadeIn"
              key={user._id}
            >
              <Link
                href={`/profile` + `?user=${user._id}`}
                className="flex gap-2"
              >
                <Image
                  src={ProfilePlaceholder}
                  alt="user"
                  priority
                  width={40}
                  height={40}
                  className="w-14 h-14 rounded-full"
                />

                <div className="flex flex-col w-full pr-10">
                  <h2 className="text-xl">{user.username}</h2>
                  <p className="truncate text-zinc-400/70 w-11/12">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Temporibus, sapiente. Alias neque ducimus provident
                    accusantium aliquam, non voluptatibus officiis repellendus.
                  </p>
                </div>
              </Link>
            </li>
          ))
        ) : (
          <div>No users found</div>
        )}
      </ul>
    </div>
  );
}
