"use client";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaArrowUp } from "react-icons/fa";
import { addComment } from "@/actions/posts/comments/addComment";
import { CommentType } from "@/types/post/postType";
import Comment from "./comment";

interface CommentsSectionProps {
  comments: CommentType[];
  postId: string;
  setShowComments?: (showComments: boolean) => void;
  setAddedCommentCounter?: (addedCommentCounter: number) => void;
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
    setShowComments && setShowComments(false);
  };

  const handleClickInside = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await addComment(postId, comment);
    if (response?.status === 200) {
      setComment("");
      setAddedCommentCounter && setAddedCommentCounter(addedCommentCounter + 1);
    }
  };
  return (
    <div
      onClick={handleClickOutside}
      className="fixed inset-0 z-50 flex h-[100dvh] w-full items-end justify-center bg-black/60 md:items-center"
    >
      <div
        onClick={handleClickInside}
        className="absolute z-50 flex h-5/6 w-full animate-fadeIn flex-col items-center justify-center gap-6 rounded-t-xl border-t-2 border-postBackground/50 bg-black/90 p-2 md:p-6 md:shadow-glow md:shadow-postBackground/50 transition-all duration-500 md:w-5/12 md:rounded-xl md:border-2"
      >
        <h2>
          <span className="neon-text bg-gradient-to-r from-sky-200 via-sky-400 to-sky-200 bg-clip-text text-center text-xl font-extrabold text-transparent md:text-3xl">
            Comments
          </span>
        </h2>
        <button
          className="absolute right-2 top-2 rounded-full p-1 md:p-0"
          onClick={() => setShowComments && setShowComments(false)}
        >
          <IoClose className="h-7 w-7 cursor-pointer transition-all duration-500 fill-sky-100 hover:scale-105 hover:fill-postBackground/70 md:h-10 md:w-10" />
        </button>
        <ul className="flex h-full w-full flex-col items-center py-2 gap-4 overflow-y-auto scrollbar-thin">
          {comments.length ? (
            comments.map((commentContent) => (
              <li
                className="flex w-full flex-col items-center justify-center"
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
          className="flex w-full items-center justify-center gap-4"
        >
          <textarea
            name="Comment section"
            id="comment"
            placeholder="Write a comment..."
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            rows={1}
            className="w-full resize-none rounded-lg border-2 border-zinc-600 bg-transparent p-2 text-sm transition-all duration-500 focus:border-postBackground/50 focus:shadow-glow focus:shadow-postBackground/50 focus:outline-none"
          />
          <button
            type="submit"
            disabled={comment.length === 0}
            className={`flex h-full w-20 items-center justify-center rounded-lg border-2 transition-all duration-500 hover:scale-105 ${
              comment.length > 0
                ? "border-postBackground/50 shadow-glow-sm shadow-postBackground/50"
                : "border-zinc-600 shadow-none"
            } `}
          >
            <FaArrowUp
              className={`h-5 w-5 ${
                comment.length > 0
                  ? "animate-bounce text-postBackground/70 transition-all duration-500"
                  : "text-zinc-600"
              }`}
            />
          </button>
        </form>
      </div>
    </div>
  );
}
