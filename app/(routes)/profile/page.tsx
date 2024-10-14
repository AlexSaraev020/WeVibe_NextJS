import React from "react";
import Image from "next/image";
import ProfilePlaceholder from "@/public/placeholders/profilePlaceholder.png";
import { IoIosSettings } from "react-icons/io";

export default function Page() {
  return (
    <div className="h-screen w-full flex flex-col items-center ">
      <div className="w-full flex items-center justify-center p-4 gap-4 z-50">
          <Image
            src={ProfilePlaceholder}
            alt="user"
            className=" w-28 h-28 md:w-48 md:h-48 rounded-full"
          />
          
        <div className="flex flex-col">
          <h1 className=" text-xl md:text-3xl font-semibold">Alexandru-test</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
          </p>
          <div className="flex w-full justify-around">
            <div className="flex flex-col items-center justify-center">
              <h2 className="font-bold text-xl">Posts</h2>
              <h2 className="font-bold">4</h2>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h2 className="font-bold text-xl">Follows</h2>
              <h2 className="font-bold">2</h2>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h2 className="font-bold text-xl">Followers</h2>
              <h2 className="font-bold">223</h2>
            </div>
          </div>
          <div className="flex ">
            <button className="w-32 text-xl md:text-2xl rounded-md border-2 border-sky-500 transition-all duration-500 hover:scale-110 shadow-glow shadow-sky-500 hover:shadow-sky-400 hover:border-sky-400 hover:text-sky-400">
              Follow
            </button>
            <button className="flex items-center justify-center gap-1 w-32 text-lg md:text-xl rounded-md border-2 border-zinc-500 transition-all duration-500 hover:scale-110 shadow-glow shadow-zinc-500 hover:shadow-zinc-400 hover:border-zinc-400 hover:text-zinc-300">
            <h2>Edit</h2>
            <IoIosSettings className="w-6 h-6" />
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}
