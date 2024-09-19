"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import SearchProfileCard from "@/components/cards/searchProfileCard";
export default function Page() {
  const searchParams = useSearchParams();
  const search = searchParams.get("q");
  return (
    <div className=" flex-1 w-full flex items-start py-20 justify-center">
      <ul className="flex flex-col w-full items-center gap-10 py-10 overflow-auto">
        <li className="w-full flex items-center justify-center h-full">
          <SearchProfileCard />
        </li>
        <li className="w-full flex items-center justify-center h-full">
          <SearchProfileCard />
        </li>
        <li className="w-full flex items-center justify-center h-full">
          <SearchProfileCard />
        </li>
        <li className="w-full flex items-center justify-center h-full">
          <SearchProfileCard />
        </li>
        <li className="w-full flex items-center justify-center h-full">
          <SearchProfileCard />
        </li>
        <li className="w-full flex items-center justify-center h-full">
          <SearchProfileCard />
        </li>
      </ul>
    </div>
  );
}
