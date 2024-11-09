import { getUsersByQuery } from "@/actions/user/getUser";
import { UserType } from "@/types/userTypes/user/userType";
import React from "react";
import Image from "next/image";
import ProfilePlaceholder from "@/public/placeholders/profilePlaceholder.png";
import Link from "next/link";

export default async function Page(
  props: {
    searchParams: Promise<{ q: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const response = await getUsersByQuery(searchParams.q);

  return (
    <div className=" flex-1 w-full flex items-start justify-center">
      <ul className="flex flex-col w-full items-center justify-start gap-10 overflow-auto py-10">
        {response.users.length > 0 ? (
          response.users.map((user: UserType) => (
            <li
              className="relative p-3 flex flex-col w-4/12 hover:shadow-glow rounded-lg hover:shadow-postBackground/50 border-2 border-transparent hover:border-postBackground/50 delay-100 transition-all duration-500 hover:scale-105 animate-fadeIn"
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

                <div className="flex flex-col justify-center w-full pr-10">
                  <h2 className="text-xl">{user.username}</h2>
                  <p className="truncate text-zinc-400/70 w-11/12">
                    {user.bio}
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
