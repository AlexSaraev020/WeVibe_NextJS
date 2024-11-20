"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { GoKebabHorizontal } from "react-icons/go";
import { FaRegTrashAlt } from "react-icons/fa";
import { allowDelete } from "@/actions/posts/deletion/alllowDelete";
import { deletePost } from "@/actions/posts/deletion/delete";
import { useRouter } from "next/navigation";
import { AiOutlineLoading } from "react-icons/ai";

interface Props {
  userId: string;
  postId: string;
  imageUrl: string;
}
export default function KebabSection({ userId, postId, imageUrl }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [allow, setAllow] = useState<boolean | undefined>(false);
  const router = useRouter();
  useEffect(() => {
    if (isOpen && userId) {
      (async () => {
        await allowDelete({ userId, setAllow, setLoading });
      })();
    }
  }, [userId, isOpen]);
  const handleDelete = async () => {
    await deletePost({ postId, createdBy: userId, imageUrl, router });
  };
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute right-4 top-3 z-40 rounded-full p-1"
      >
        <GoKebabHorizontal className="text-2xl text-gray-400 md:text-3xl" />
      </button>
      {isOpen && (
        <div className="absolute right-4 top-16 z-40 flex animate-fadeIn flex-col gap-2 rounded-xl border-2 border-postBackground/50 bg-neutral-950 p-2 text-xs text-gray-400 shadow-glow-sm shadow-postBackground/50 transition-all duration-500 md:text-base">
          {loading ? (
            <AiOutlineLoading className="animate-spin" />
          ) : (
            allow && (
              <button
                onClick={handleDelete}
                className="z-50 flex items-center gap-1 hover:text-gray-100"
              >
                <h2>Delete</h2> <FaRegTrashAlt className="h-4 w-4" />
              </button>
            )
          )}
          {!loading && (
            <Link
              href={`/profile?user=${userId}`}
              className="hover:text-gray-100"
            >
              Go to profile
            </Link>
          )}
        </div>
      )}
    </>
  );
}
