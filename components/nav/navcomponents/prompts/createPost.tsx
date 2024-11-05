"use client";
import React, { useState } from "react";
import Image from "next/image";
import { UploadDropzone } from "@/utils/uploadthing";
import axios from "axios";
import { createPost } from "@/actions/posts/createPost";
import { useRouter } from "next/navigation";
import FormInput from "@/components/authForm/formElements/input";

interface CreatePostProps {
  setShowCreatePost: (showCreatePost: boolean) => void;
}

export default function CreatePost({ setShowCreatePost }: CreatePostProps) {
  const [image, setImage] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const router = useRouter();
  const cancelCreatePost = async () => {
    try {
      if (!image) {
        setShowCreatePost(false);
      }
      await axios.delete("api/uploadthing", {
        data: {
          url: image,
        },
      });
      if (image) {
        setImage("");
      }
      setShowCreatePost(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await createPost({ title, description, image });
      if (response) {
        setShowCreatePost(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
  return (
    <div className="fixed bg-black/60 h-[100dvh] w-full z-50 inset-0 flex items-center justify-center">
      <form
        onSubmit={handleCreatePost}
        className="bg-black/90 ease-in-out hover:bg-black/70 md:w-4/12 border-2 border-sky-600 transition-all duration-1000 flex flex-col gap-6 p-6 rounded-xl shadow-glow shadow-sky-500 animate-fadeIn"
      >
        <h2 className="text-3xl py-1 md:text-5xl font-extrabold bg-gradient-to-r from-sky-200 via-sky-400 to-sky-200 text-center text-transparent bg-clip-text neon-text">
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
                className="rounded-xl max-h-96 object-cover"
              />
            ) : (
              <>
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
                  onUploadProgress={(progress) => {
                    setProgress(progress);
                  }}
                  className=" h-40 md:h-96 border-none hover:scale-105 transition-all duration-500"
                  endpoint="imageUploader"
                />
                <div className="w-full bg-zinc-700 rounded-full h-2.5 mb-4 ">
                  <div
                    className="bg-sky-600 h-2.5 rounded-full  transition-all duration-500 shadow-glow-sm shadow-sky-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </>
            )}
          </label>
          <div className="flex flex-col gap-2">
            <FormInput
              type="text"
              id="title"
              placeholder="Enter post title"
              required
              onChange={(e) => setTitle(e.target.value)}
              name={"Title"}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-xl focus:outline-none outline-none"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              minLength={10}
              id="description"
              value={description}
              placeholder="Enter post description"
              onChange={(e) => setDescription(e.target.value)}
              className="bg-black border focus:border-none rounded-md placeholder-zinc-500 p-2 transition-all duration-500 focus:outline-none focus:outline-sky-400 shadow-none focus:shadow-glow focus:shadow-sky-500"
            />
          </div>
        </div>
        <div className="flex w-full items-center justify-start gap-10">
          <button
            disabled={
              image?.length || (title?.length && description?.length)
                ? false
                : true
            }
            className={
              image?.length || (title?.length && description?.length)
                ? "bg-white/90 shadow-glow-sm hover:shadow-glow shadow-zinc-400/90 hover:shadow-white hover:bg-white transition-all duration-500 hover:scale-105 text-black text-lg font-extrabold py-2 w-32 rounded-xl "
                : "bg-white/10 shadow-glow-sm shadow-zinc-400/60 text-white/50 text-lg font-extrabold py-2 w-32 rounded-xl"
            }
          >
            Create Post
          </button>
          <button
            type="button"
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
