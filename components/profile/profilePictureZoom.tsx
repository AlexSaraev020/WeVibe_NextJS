"use client";
import React, { useState } from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

interface ProfilePictureZoomProps {
  image: string;
}
export default function ProfilePictureZoom({ image }: ProfilePictureZoomProps) {
  const [zoom, setZoom] = useState<boolean>(true);
  return (
    <div
      onClick={() => setZoom(!zoom)}
      className="relative h-20 w-20 md:h-48 md:w-48"
    >
      <Image
        src={image}
        width={400}
        height={400}
        priority
        alt="user"
        className={twMerge(
          "absolute z-10 mt-6 h-full w-full rounded-full border-4 border-slate-800 transition-all duration-500 hover:border-postBackground/30 hover:shadow-glow hover:shadow-postBackground/20 md:mt-0",
          zoom ? "object-cover" : "object-contain",
        )}
      />
      <Image
        src={image}
        width={400}
        height={400}
        priority
        alt="user"
        className="absolute inset-0 z-0 mt-6 h-full w-full rounded-full object-cover opacity-50 md:mt-0"
      />
    </div>
  );
}
