"use client";
import { GradualSpacing } from "@/components/textAnimation/gradualSpacing";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaArrowUp } from "react-icons/fa";
import { addComment } from "@/actions/posts/comments/addComment";
import { CommentType } from "@/types/post/postType";
import Comment from "./comment";

interface CommentsSectionProps {
  comments: CommentType[];
  postId: string;
  setShowComments: (showComments: boolean) => void;
  setAddedCommentCounter: (addedCommentCounter: number) => void;
  addedCommentCounter: number;
}

export default function CommentsSection({
  postId,
  comments,
  setShowComments,
  setAddedCommentCounter,
  addedCommentCounter,
}: CommentsSectionProps) {
  const [comment, setComment] = useState<string>("");

  const handleClickOutside = () => {
    setShowComments(false);
  };

  const handleClickInside = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await addComment(postId, comment);
    if (response?.status === 200) {
      setComment("");
      setAddedCommentCounter(addedCommentCounter + 1);
    }
  };
  return (
    <div
      onClick={handleClickOutside}
      className="fixed bg-black/60 h-[100dvh] w-full z-50 inset-0 flex items-center justify-center"
    >
      <div
        onClick={handleClickInside}
        className="relative bg-black/90 w-11/12 h-5/6 md:w-5/12 border-2 border-sky-500 transition-all duration-500 flex flex-col items-center justify-center gap-6 p-6 rounded-xl shadow-glow shadow-sky-500 animate-fadeIn"
      >
        <GradualSpacing
          text="Comments"
          className="text-zinc-200 z-10 text-lg md:text-2xl font-bold"
        />
        <button
          className="absolute top-2 right-2"
          onClick={() => setShowComments(false)}
        >
          <IoClose className="cursor-pointer w-7 h-7 md:w-10 md:h-10 hover:scale-105 transition-all duration-500 hover:text-sky-400" />
        </button>
        <ul className="w-full flex flex-col items-center overflow-y-auto h-full gap-4 scrollbar-thin ">
          {comments.length ? (
            comments.map((commentContent) => (
              <li
                className="w-full flex flex-col items-center justify-center"
                key={commentContent._id}
              >
                <Comment
                  key={commentContent._id}
                  commentContent={commentContent}
                />
              </li>
            ))
          ) : (
            <div>
              <p className="text-zinc-200">No comments yet</p>
            </div>
          )}
        </ul>
        <form
          onSubmit={handleSubmitComment}
          className="flex items-center justify-center w-full gap-4"
        >
          <textarea
            name="Comment section"
            id="comment"
            placeholder="Write a comment..."
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            rows={2}
            className="rounded-lg resize-none w-11/12 bg-transparent border-2 border-zinc-600 focus:border-sky-500 focus:outline-none focus:shadow-glow focus:shadow-sky-500 transition-all duration-500 p-2.5 text-sm"
          />
          <button
            type="submit"
            disabled={comment.length === 0}
            className={`w-1/12 flex items-center justify-center border-2  h-full rounded-lg transition-all duration-500 hover:scale-105 ${
              comment.length > 0
                ? "shadow-glow-sm shadow-sky-500 border-sky-500"
                : "shadow-none border-zinc-600"
            } `}
          >
            <FaArrowUp
              className={`w-6 h-6 ${
                comment.length > 0
                  ? "animate-bounce text-sky-500 transition-all duration-500"
                  : "text-zinc-600 "
              }`}
            />
          </button>
        </form>
      </div>
    </div>
  );
}
