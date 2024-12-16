import { getUsersByQuery } from "@/actions/user/searchUser";
import { UserType } from "@/types/userTypes/user/userType";
import React from "react";
import ProfileCard from "@/components/cards/profileCard/profileCard";

export default async function Page(
  props: {
    searchParams: Promise<{ q: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const response = await getUsersByQuery(searchParams.q);

  return (
    <div className=" flex-1 w-full flex items-start justify-center">
      <ul className="flex flex-col w-full px-5 md:w-5/12 items-center justify-start gap-10 overflow-auto py-10">
        {response.users.length > 0 ? (
          response.users.map((user: UserType) => (
            <ProfileCard
              key={user._id}
              id={user._id}
              username={user.username}
              image={user.image.url}
              bio={user.bio}
            />
          ))
        ) : (
          <h2>No users found</h2>
        )}
      </ul>
    </div>
  );
}
