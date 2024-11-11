"use client";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaArrowUp } from "react-icons/fa";
import { addComment } from "@/actions/posts/comments/addComment";
import { CommentType } from "@/types/post/postType";
import Comment from "./comment";
import { getComments } from "@/actions/posts/comments/getComments";

interface CommentsSectionProps {
  postId: string;
  setShowComments?: (showComments: boolean) => void;
  setAddedCommentCounter?: (addedCommentCounter: number) => void;
  addedCommentCounter: number;
  showComments: boolean;
}

export default function CommentsSection({
  postId,
  setShowComments,
  setAddedCommentCounter,
  addedCommentCounter,
  showComments,
}: CommentsSectionProps) {
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<CommentType[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      if (showComments) {
        const comments = await getComments(postId);
        if (!comments) {
          setComments([]);
        }
        setComments(comments);
      } else {
        setComments([]);
      }
    };
    fetchComments();
  }, [addedCommentCounter, postId, showComments]);
  const handleClickOutside = () => {
    setShowComments && setShowComments(false);
  };

  const handleClickInside = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setComment("");
    const response = await addComment(postId, comment);
    if (response?.status === 200) {
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
        className="absolute z-50 flex h-5/6 w-full animate-fadeIn flex-col items-center justify-center gap-6 rounded-t-xl border-t-2 border-postBackground/50 bg-black/90 p-2 transition-all duration-500 md:w-5/12 md:rounded-xl md:border-2 md:p-6 md:shadow-glow md:shadow-postBackground/50"
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
          <IoClose className="h-7 w-7 cursor-pointer fill-sky-100 transition-all duration-500 hover:scale-105 hover:fill-postBackground/70 md:h-10 md:w-10" />
        </button>
        <ul className="flex h-full w-full flex-col items-center gap-4 overflow-y-auto py-2 scrollbar-thin">
          {comments.length ? (
            comments.map((commentContent) => (
              <li
                className="flex w-full flex-col items-center justify-center"
                key={commentContent._id}
              >
                <Comment commentContent={commentContent} />
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
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setComment(e.target.value)
            }
            value={comment}
            rows={1}
            aria-label="Write a comment"
            className="w-full resize-none rounded-lg border-2 border-zinc-600 bg-transparent p-2 text-sm transition-all duration-500 focus:border-postBackground/50 focus:shadow-glow focus:shadow-postBackground/50 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Submit comment"
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
