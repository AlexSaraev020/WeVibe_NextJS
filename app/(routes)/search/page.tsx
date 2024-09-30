"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchProfileCard from "@/components/cards/searchProfileCard";
import { getUsersByQuery } from "@/actions/user/getUser";
export default function Page() {
  const searchParams = useSearchParams();
  const search = searchParams.get("q");
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    if (search) {
      document.title = `${search} - WeVibe`;
    }
    const getUser = async () => {
      try {
        if (!search) {
          return;
        }
        const response = await getUsersByQuery(search);
        console.log(response.users);
        if (response.status === 200) {
          setUsers(response.users);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    getUser();
  }, [search]);

  return (
    <div className=" flex-1 w-full flex items-start py-20 justify-center">
      <ul className="flex flex-col w-full items-center gap-10 py-10 overflow-auto">
        <li className="w-full flex items-center justify-center h-full">
          <SearchProfileCard />
        </li>
      </ul>
    </div>
  );
}
