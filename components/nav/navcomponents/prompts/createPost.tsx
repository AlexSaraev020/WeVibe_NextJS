"use client";
import React, { useState } from "react";
import Image from "next/image";
import { UploadDropzone } from "@/utils/uploadthing";
import axios from "axios";

interface CreatePostProps {
  setShowCreatePost: (showCreatePost: boolean) => void;
}

export default function CreatePost({ setShowCreatePost }: CreatePostProps) {
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const cancelCreatePost = async () => {
    try {
      await axios.delete("api/uploadthing", {
        data: {
          url: image,
        },
      });
      if (image) {
        setImage(null);
      }
      setShowCreatePost(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="fixed bg-black/60 h-screen w-full z-50 inset-0 flex items-center justify-center">
      <form className="bg-black/90 ease-in-out hover:bg-black/70 delay-100 md:w-4/12 border-2 border-gray-800 transition-all duration-1000 flex flex-col gap-6 p-6 rounded-xl shadow-glow shadow-white animate-fadeIn">
        <h2 className="text-3xl py-1 md:text-5xl font-extrabold bg-gradient-to-r from-white via-gray-400 to-gray-200 text-center text-transparent bg-clip-text neon-text">
          Create Post
        </h2>
        <div className="flex flex-col gap-4">
          <label htmlFor="image-input">
            {image?.length ? (
              <Image
                src={image}
                alt="Preview"
                width={600}
                height={400}
                className="rounded-xl"
              />
            ) : (
              <UploadDropzone
                config={{
                  mode: "auto",
                }}
                appearance={{
                  button: {
                    display: "none",
                  },
                }}
                onClientUploadComplete={(res) => {
                  setImage(res[0].url);
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
                endpoint="imageUploader"
              />
            )}
          </label>
          <div className="flex flex-col gap-2">
            <label className="text-white/80" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl p-2 bg-black text-white placeholder:text-white/50"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              placeholder="Enter post description"
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl p-2 bg-black text-white placeholder:text-white/50"
            />
          </div>
        </div>
        <div className="flex w-full items-center justify-start gap-10">
          <button
            disabled={image?.length ? false : true}
            className={
              image?.length
                ? "bg-white/90 shadow-glow-sm hover:shadow-glow shadow-zinc-400/90 hover:shadow-white hover:bg-white transition-all duration-500 hover:scale-105 text-black text-lg font-extrabold py-2 w-32 rounded-xl "
                : "bg-white/10 shadow-glow-sm shadow-zinc-400/60 text-white/50 text-lg font-extrabold py-2 w-32 rounded-xl"
            }
          >
            Create Post
          </button>
          <button
            onClick={cancelCreatePost}
            className=" border-2 border-white/90 shadow-glow-sm hover:shadow-glow shadow-white/90 hover:shadow-white hover:border-white transition-all duration-500 hover:scale-105 text-lg font-extrabold py-2 w-32 rounded-xl "
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
