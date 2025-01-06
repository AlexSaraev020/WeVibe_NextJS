import React from "react";

export default function LoadingPostComponent() {
  return (
    <div className="relative mb-4 flex h-[24rem] w-full flex-col items-start justify-center rounded-xl from-postBackground/10 via-postBackground/40 to-postBackground/10 px-0 transition-all duration-500 md:mb-10 md:h-[40rem] md:bg-gradient-to-b md:px-2 md:shadow-glow md:shadow-postBackground/50 xl:mb-20">
      <div className="flex w-full justify-between">
        <div className="flex w-fit items-center py-2 transition-all duration-500 md:p-2">
          <div className="h-9 w-9 animate-pulse rounded-full bg-gray-300/20 md:h-12 md:w-12"></div>
          <div className="ml-2 h-4 w-20 animate-pulse rounded-full bg-gray-300/20 md:h-6 md:w-32"></div>
        </div>
        <div className="mt-2 h-6 w-6 animate-pulse rounded-full bg-gray-300/20 md:h-8 md:w-8"></div>
      </div>
      <div className="relative h-full w-full animate-pulse rounded-xl bg-gray-300/20 transition-all duration-500 md:p-0"></div>
      <div className="w-full px-2 py-4">
        <div className="mb-2 h-4 w-32 animate-pulse rounded-full bg-gray-300/20 md:h-6 md:w-40"></div>
        <div className="h-4 w-full animate-pulse rounded-full bg-gray-300/20 md:h-6"></div>
      </div>
    </div>
  );
}
