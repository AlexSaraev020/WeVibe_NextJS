"use client";
import React, { useState } from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { useUserNavData } from "@/contexts/user/userNavContext";
import defaultImage from "@/public/placeholders/profilePlaceholder.png"

export default function ProfilePictureZoom() {
  const [zoom, setZoom] = useState<boolean>(true);
  const { userImage } = useUserNavData();
  return (
    <div
      onClick={() => setZoom(!zoom)}
      className="relative h-20 w-20 md:h-28 md:w-28"
    >
      <Image
        src={userImage.url?.length ? userImage.url : defaultImage}
        width={400}
        height={400}
        priority
        alt="user"
        className={twMerge(
          "absolute z-10 h-full w-full rounded-full border-4 border-slate-800 transition-all duration-500 hover:border-postBackground/30 hover:shadow-glow hover:shadow-postBackground/20",
          zoom ? "object-cover" : "object-contain",
        )}
      />
      <Image
        src={userImage.url?.length ? userImage.url : defaultImage}
        width={400}
        height={400}
        priority
        alt="user"
        className="absolute inset-0 z-0 h-full w-full rounded-full object-cover opacity-50 "
      />
    </div>
  );
}
