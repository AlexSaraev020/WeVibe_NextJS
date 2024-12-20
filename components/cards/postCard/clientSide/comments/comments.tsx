"use client";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { addComment } from "@/actions/posts/comments/addComment";
import Comment from "./comment";
import { getComments } from "@/actions/posts/comments/getComments";
import { AiOutlineLoading } from "react-icons/ai";
import Textarea from "@/components/forms/formElements/textarea";
import { LuSend } from "react-icons/lu";
import { CommentType } from "@/types/post/comments/commentsType";
import { useAlert } from "@/contexts/alert/alertContext";

interface CommentsSectionProps {
  postId: string;
  setShowComments: (showComments: boolean) => void;
  setAddedCommentCounter: (
    updateCounter: (prevCounter: number) => number,
  ) => void;
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
  const [loading, setLoading] = useState<boolean>(true);
  const { setMessage } = useAlert();
  useEffect(() => {
    const fetchComments = async () => {
      if (showComments) {
        await getComments({ postId, setLoading, setComments });
      } else {
        setComments([]);
      }
    };
    fetchComments();
  }, [addedCommentCounter, postId, showComments]);
  const handleClickOutside = () => {
    setShowComments(false);
  };

  const handleClickInside = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!comment.trim()) {
      setMessage("Comment cannot start with a space or be empty");
      return;
    }
    await addComment({ postId, comment, setComment, setAddedCommentCounter });
  };
  return (
    <div
      onClick={handleClickOutside}
      className="fixed inset-0 z-50 flex w-full items-end justify-center bg-black/60 md:items-center"
    >
      <div
        onClick={handleClickInside}
        className="absolute z-50 flex h-5/6 w-full flex-col items-center justify-center gap-6 rounded-t-xl border-t-2 border-postBackground/50 bg-black/90 p-2 shadow-glow shadow-postBackground/50 transition-all duration-500 md:w-5/12 md:rounded-xl md:border-2 md:p-6 md:shadow-glow md:shadow-postBackground/50"
      >
        <h2 className="bg-gradient-to-r from-sky-200 via-sky-400 to-sky-200 bg-clip-text text-center text-xl font-extrabold text-transparent md:text-3xl">
          Comments
        </h2>
        <button
          className="absolute right-2 top-2 rounded-full p-1 md:p-0"
          onClick={() => setShowComments && setShowComments(false)}
        >
          <IoClose className="h-7 w-7 cursor-pointer fill-sky-100 transition-all duration-500 hover:scale-105 hover:fill-postBackground/70 md:h-10 md:w-10" />
        </button>
        <ul className="flex h-full w-full flex-col items-center gap-4 overflow-y-auto py-2 scrollbar-none">
          {comments && comments.length > 0 ? (
            comments.map((commentContent) => (
              <li
                className="flex h-fit w-full flex-col items-center justify-center px-2"
                key={commentContent._id}
              >
                <Comment
                  setAddedCommentCounter={setAddedCommentCounter}
                  postId={postId}
                  commentContent={commentContent}
                />
              </li>
            ))
          ) : (
            <div>
              <p className="text-zinc-200">
                {loading ? (
                  <AiOutlineLoading className="animate-spin" />
                ) : (
                  "No comments"
                )}
              </p>
            </div>
          )}
        </ul>
        <form
          onSubmit={handleSubmitComment}
          className="flex w-full items-end justify-center gap-4"
        >
          <Textarea
            name="comment"
            id="comment"
            value={comment}
            placeHolder="Write a comment..."
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setComment(e.target.value)
            }
            rows={1}
            minLength={1}
            maxLength={2000}
            ariaLabel="Comment"
          />
          <button
            type="submit"
            aria-label="Submit comment"
            disabled={comment.length === 0}
            className={`flex h-full w-12 items-center justify-center rounded-lg border-2 transition-all duration-500 hover:scale-105 ${
              comment.length > 0
                ? "border-postBackground/50 shadow-glow-sm shadow-postBackground/50"
                : "border-zinc-600 shadow-none"
            } `}
          >
            <LuSend
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
