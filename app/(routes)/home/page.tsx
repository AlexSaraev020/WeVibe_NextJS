import React from "react";
import { PostList } from "@/components/homepage/postList";

export const revalidate = 60;
export default async function Page() {
 
  return (
    <div className="flex h-[100dvh] w-full items-center justify-center transition-all duration-500 md:p-4">
      <PostList />
    </div>
  );
}
