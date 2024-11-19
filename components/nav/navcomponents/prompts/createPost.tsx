"use client";
import React, { useState } from "react";
import Image from "next/image";
import { UploadDropzone } from "@/utils/uploadthing";
import axios from "axios";
import { createPost } from "@/actions/posts/createPost";
import { useRouter } from "next/navigation";
import FormInput from "@/components/authForm/formElements/input";
import { twMerge } from "tailwind-merge";

interface CreatePostProps {
  setShowCreatePost: (showCreatePost: boolean) => void;
}

export default function CreatePost({ setShowCreatePost }: CreatePostProps) {
  const [image, setImage] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [imageCover, setImageCover] = useState<boolean>(false);
  const router = useRouter();
  const cancelCreatePost = async () => {
    try {
      if (image) {
        await axios.delete("api/uploadthing", {
          data: { url: image },
        });
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
    <div className="fixed inset-0 z-50 flex h-[100dvh] w-full items-center justify-center bg-black/60">
      <form
        onSubmit={handleCreatePost}
        className="flex animate-fadeIn flex-col gap-6 rounded-xl border-2 border-sky-600 bg-black/90 p-6 shadow-glow shadow-sky-500 transition-all duration-1000 ease-in-out hover:bg-black/70 md:w-4/12"
      >
        <h2 className="neon-text bg-gradient-to-r from-sky-200 via-sky-400 to-sky-200 bg-clip-text py-1 text-center text-2xl font-extrabold text-transparent md:text-5xl">
          Create Post
        </h2>
        <div className="flex flex-col gap-4">
          <label htmlFor="image-input max-h-72">
            {image?.length ? (
              <Image
                onClick={() => setImageCover(!imageCover)}
                src={image}
                alt="Preview"
                width={600}
                height={400}
                className={twMerge(
                  "max-h-72 rounded-xl object-cover md:max-h-96",
                  imageCover ? "object-cover" : "object-contain",
                )}
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
                  className="h-40 border-none transition-all duration-500 hover:scale-105 md:h-96"
                  endpoint="imageUploader"
                />
                <div className="mb-4 h-2.5 w-full rounded-full bg-zinc-700">
                  <div
                    className={`h-2.5 rounded-full bg-sky-600 shadow-glow-sm w-[${progress}%] shadow-sky-500 transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </>
            )}
          </label>
          <div className="flex flex-col gap-2">
            <FormInput
              minLength={2}
              maxLength={50}
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
              className="text-sm outline-none focus:outline-none md:text-xl"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              minLength={2}
              maxLength={500}
              rows={1}
              id="description"
              value={description}
              placeholder="Enter post description"
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-md border bg-black p-2 placeholder-zinc-500 shadow-none transition-all duration-500 focus:border-none focus:shadow-glow focus:shadow-sky-500 focus:outline-none focus:outline-sky-400"
            />
          </div>
        </div>
        <div className="flex w-full items-center justify-start gap-10">
          <button
            disabled={image?.length ? false : true}
            className={
              image?.length
                ? "w-32 rounded-xl bg-white/90 py-2 text-lg font-extrabold text-black shadow-glow-sm shadow-zinc-400/90 transition-all duration-500 hover:scale-105 hover:bg-white hover:shadow-glow hover:shadow-white"
                : "w-32 rounded-xl bg-white/10 py-2 text-lg font-extrabold text-white/50 shadow-glow-sm shadow-zinc-400/60"
            }
          >
            Create Post
          </button>
          <button
            type="button"
            onClick={cancelCreatePost}
            className="w-32 rounded-xl border-2 border-white/90 py-2 text-lg font-extrabold shadow-glow-sm shadow-white/90 transition-all duration-500 hover:scale-105 hover:border-white hover:shadow-glow hover:shadow-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
