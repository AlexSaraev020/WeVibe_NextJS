"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { GoKebabHorizontal } from "react-icons/go";
import { FaRegTrashAlt } from "react-icons/fa";
import { allowDelete } from "@/actions/posts/deletion/alllowDelete";
import { deletePost } from "@/actions/posts/deletion/delete";
import { useRouter } from "next/navigation";
import { AiOutlineLoading } from "react-icons/ai";
import { KebabSectionCombinedProps } from "@/types/post/kebabSection";
import { allowDeleteComment } from "@/actions/posts/comments/deletion/allowDeleteComment";
import { deleteComment } from "@/actions/posts/comments/deletion/deleteComment";
import { allowDeleteReply } from "@/actions/posts/comments/replies/deletion/allowDeleteRply";
import { deleteReply } from "@/actions/posts/comments/replies/deletion/deleteReply";
import { DeletePostPrompt } from "./replies/deletePostPrompt";

export default function KebabSection(props: KebabSectionCombinedProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [allow, setAllow] = useState<boolean>(false);
  const [showDeletePostPrompt,setShowDeletePostPrompt] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    switch (props.type) {
      case "post":
        if (isOpen) {
          (async () => {
            await allowDelete({ postId: props.postId, setAllow, setLoading });
          })();
        }
        break;
      case "comment":
        if (isOpen) {
          (async () => {
            await allowDeleteComment({
              commentId: props.commentId,
              setAllow,
              setLoading,
            });
          })();
        }
        break;
      case "reply":
        if (isOpen) {
          (async () => {
            await allowDeleteReply({
              _id: props._id,
              setAllow,
              setLoading,
            });
          })();
        }
        break;
    }
  }, [isOpen]);
  const handleDelete = async () => {
    switch (props.type) {
      case "post":
        await deletePost({
          setShowPostFullScreen: props.setShowPostFullScreen,
          postId: props.postId,
          createdBy: props.userId,
          image: props.image,
          setPosts: props.setPosts,
        });
        break;
      case "comment":
        await deleteComment({
          commentId: props.commentId,
          postId: props.postId,
          setComments: props.setComments,
        });
        break;
      case "reply":
        await deleteReply({
          replyId: props._id,
          commentId: props.commentId,
          setReplies: props.setReplies,
        });
        break;
    }
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);
  return (
    <>
    {showDeletePostPrompt && <DeletePostPrompt handleDelete={handleDelete} setShowDeletePostPrompt={setShowDeletePostPrompt}/>}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="z-20 rounded-full p-1"
      >
        <GoKebabHorizontal className={`h-6 w-6 text-white md:text-3xl`} />
      </button>
      {isOpen && (
        <div
          ref={menuRef}
          className={`absolute ${props.type === "post" ? "right-4 top-16" : "right-0 top-8"} z-40 flex animate-fadeIn flex-col gap-2 rounded-xl border-2 border-postBackground/50 bg-neutral-950 p-2 text-xs text-gray-400 shadow-glow-sm shadow-postBackground/50 transition-all duration-500 md:text-base`}
        >
          {loading ? (
            <AiOutlineLoading className="animate-spin" />
          ) : (
            allow && (
              <button
                onClick={() => setShowDeletePostPrompt(true)}
                type="button"
                className="z-50 flex items-center gap-1 hover:text-gray-100"
              >
                <h2
                  className={`${props.type === "post" ? "text-xs md:text-base" : ""}`}
                >
                  Delete
                </h2>{" "}
                <FaRegTrashAlt className="h-3 w-3 md:h-4 md:w-4" />
              </button>
            )
          )}
          {!loading && (
            <Link
              href={`/profile?user=${props.userId}`}
              className={`${props.type === "post" ? "text-xs md:text-base" : ""} hover:text-gray-100`}
            >
              Profile
            </Link>
          )}
        </div>
      )}
    </>
  );
}
