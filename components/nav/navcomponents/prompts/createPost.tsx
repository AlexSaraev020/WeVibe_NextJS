"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { createPost } from "@/actions/posts/createPost";
import { useRouter } from "next/navigation";
import FormInput from "@/components/forms/formElements/input";
import { twMerge } from "tailwind-merge";
import Textarea from "@/components/forms/formElements/textarea";
import ShinyButton from "@/components/buttons/shinyButton";
import { useAlert } from "@/contexts/alert/alertContext";
import Upload from "@/components/uploadImage/upload";
import { ImageType } from "@/types/image/imageType";
import { deleteImage } from "@/actions/posts/deletion/deleteImage";

interface CreatePostProps {
  setShowCreatePost: (showCreatePost: boolean) => void;
}

export default function CreatePost({ setShowCreatePost }: CreatePostProps) {
  const [image, setImage] = useState<ImageType | undefined>(undefined);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [imageCover, setImageCover] = useState<boolean>(true);
  const [disabled, setDisabled] = useState<boolean>(false);
  const router = useRouter();
  const { setMessage, setError } = useAlert();

  const cancelCreatePost = async () => {
    try {
      if (image) {
        await deleteImage(image);
        setImage(undefined);
      }
      setShowCreatePost(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createPost({
      title,
      setDisabled,
      setShowCreatePost,
      description,
      router,
      image,
      setMessage,
      setError,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex h-[100dvh] w-full items-center justify-center bg-black/60">
      <form
        onSubmit={handleCreatePost}
        className="flex w-11/12 animate-fadeIn flex-col gap-6 rounded-xl border-2 border-sky-600 bg-black/90 p-6 shadow-glow shadow-sky-500 transition-all duration-1000 ease-in-out hover:bg-black/70 md:w-4/12"
      >
        <h2 className="neon-text bg-gradient-to-r from-sky-200 via-sky-400 to-sky-200 bg-clip-text py-1 text-center text-2xl font-extrabold text-transparent md:text-5xl">
          Create Post
        </h2>
        <div className="relative flex flex-col gap-4">
          <label htmlFor="image-input max-h-72">
            {image ? (
              <Image
                onClick={() => setImageCover(!imageCover)}
                src={image ? image.url : ""}
                alt="Preview"
                width={600}
                height={400}
                className={twMerge(
                  "max-h-72 rounded-xl object-cover md:max-h-80",
                  imageCover ? "object-cover" : "object-contain",
                )}
              />
            ) : (
              <>
                <Upload
                  setImage={setImage}
                  setMessage={setMessage}
                  setProgress={setProgress}
                  setDisable={setDisabled}
                  image={image}
                />

                {!image && (
                  <div className="mb-4 h-1 w-full rounded-full bg-zinc-700 md:h-2">
                    <div
                      className={`h-1 rounded-full bg-sky-600 shadow-glow-sm md:h-2 w-[${progress}%] shadow-sky-500 transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </>
            )}
            {image && (
              <h2 className="w-full pt-2 text-center text-xs font-bold italic text-postBackground/90 md:text-sm">
                You can tap on image to zoom out
              </h2>
            )}
          </label>
          <div className="flex flex-col gap-2">
            <FormInput
              ariaLabel="Enter post title"
              minLength={2}
              maxLength={50}
              type="text"
              value={title}
              id="title"
              placeholder="Enter post title"
              required
              labelDisplay
              onChange={(e) => setTitle(e.target.value)}
              name={"Title"}
            />
          </div>
          <Textarea
            ariaLabel="Enter post description"
            minLength={2}
            maxLength={200}
            value={description}
            id="description"
            placeHolder="Enter post description"
            onChange={(e) => setDescription(e.target.value)}
            name={"Description"}
            rows={2}
          />
        </div>
        <div className="flex w-full items-center justify-start gap-3">
          <ShinyButton
            disabled={disabled}
            bottomLineCollor={twMerge(
              !disabled
                ? ""
                : "bg-gradient-to-r from-sky-500/0 via-neutral-500 to-sky-500/0",
            )}
            topLineColor={twMerge(
              !disabled
                ? ""
                : "bg-gradient-to-r from-sky-500/0 via-neutral-500 to-sky-500/0",
            )}
            className={twMerge(
              "w-20 text-xs font-semibold hover:shadow-lg hover:shadow-postBackground/30 md:w-24 md:text-lg",
              !image
                ? "pointer-events-none text-neutral-500 hover:shadow-neutral-700"
                : "text-sky-100",
            )}
            text={"Create"}
            background="bg-black py-2 md:py-1"
            type="submit"
          />
          <ShinyButton
            onClick={cancelCreatePost}
            bottomLineCollor="bg-gradient-to-r from-sky-500/0 via-white/70 to-sky-500/0"
            topLineColor="bg-gradient-to-r from-sky-500/0 via-white/70 to-sky-500/0"
            className="w-20 text-xs font-semibold text-white/70 hover:text-neutral-200 hover:shadow-lg hover:shadow-white/30 md:w-24 md:text-lg"
            text="Cancel"
            background="bg-black py-2 md:py-1"
            type="button"
          />
        </div>
      </form>
    </div>
  );
}
