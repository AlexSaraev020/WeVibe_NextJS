"use client";
import { getComments } from "@/actions/posts/comments/getComments";
import { CommentType } from "@/types/post/comments/commentsType";
import React, { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Comment from "./comment";
import { AiOutlineLoading } from "react-icons/ai";

interface CommentsListProps {
  postId: string;
  showComments: boolean;
  comments: CommentType[];
  setComments: (
    updateComments: (prevComments: CommentType[]) => CommentType[],
  ) => void;
  addedCommentCounter: number;
  setAddedCommentCounter: (
    updateCounter: (prevCounter: number) => number,
  ) => void;
}

export default function CommentsList({
  postId,
  comments,
  setComments,
  showComments,
  addedCommentCounter,
  setAddedCommentCounter,
}: CommentsListProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [skip, setSkip] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0 });

  useEffect(() => {
    if (inView) {
      loadMoreComments();
    }
  }, [inView, skip, showComments,addedCommentCounter]);

  const loadMoreComments = useCallback(async () => {
    if (!hasMore) return;
    setLoading(true);
    const newComments = await getComments({
      postId,
      setSkip,
      skip,
      limit: 6,
      setLoading,
      setHasMore,
    });
    if (newComments.length < 6) {
      setHasMore(false);
    }
    if (Array.isArray(newComments)) {
      setComments((prev) => [...prev, ...newComments]);
    }
    setLoading(false);
  }, [loading, hasMore, postId, skip]);

  return (
    <ul className="flex h-full w-full flex-col items-center gap-4 overflow-y-auto py-2 scrollbar-none">
      {comments.length ? (
        comments.map((commentContent, index) => (
            <li
              className="flex h-fit w-full flex-col items-center justify-center px-2"
              key={`comment-${commentContent._id}-${index}-${commentContent.createdAt}`}
            >
              <Comment
                commentContent={commentContent}
                postId={postId}
                setAddedCommentCounter={setAddedCommentCounter}
              />
            </li>
          ))
      ):(
        <li className="flex w-full items-center justify-center">
          <h3 className="text-lg text-gray-400">No comments</h3>
        </li>
      )}
      {hasMore && (
        <div
          ref={ref}
          className="flex w-full items-center justify-center pb-24 md:pb-8"
        >
          {loading && <AiOutlineLoading className="h-8 w-8 animate-spin" />}
        </div>
      )}
    </ul>
  );
}
