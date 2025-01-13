"use client";
import { getComments } from "@/actions/posts/comments/getComments";
import { CommentType } from "@/types/post/comments/commentsType";
import React, { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Comment from "./comment";
import { AiOutlineLoading } from "react-icons/ai";

interface CommentsListProps {
  postId: string;
  comments: CommentType[];
  setComments: (
    updateComments: (prevComments: CommentType[]) => CommentType[],
  ) => void;
}

export default function CommentsList({
  postId,
  comments,
  setComments,
}: CommentsListProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0 });

  useEffect(() => {
    if (inView) {
      loadMoreComments();
    }
  }, [inView]);

  useEffect(() => {
    setComments(() => []);
    setSkip(0);
    setHasMore(true);
  }, []);

  const loadMoreComments = useCallback(async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    const newComments = await getComments({
      postId,
      skip,
      limit: 6,
      setSkip,
      setLoading,
      setHasMore,
    });
    if (Array.isArray(newComments) && newComments.length) {
      setComments((prev) => [...prev, ...newComments]);
    }
    setLoading(false);
  }, [hasMore, loading, skip]);

  return (
    <ul className="flex h-full w-full flex-col items-center gap-4 overflow-y-auto py-2 scrollbar-none">
      {comments.length
        ? comments.map((commentContent: CommentType) => (
            <li
              className="flex h-fit w-full flex-col items-center justify-center px-0 md:px-2"
              key={commentContent._id}
            >
              <Comment
                commentContent={commentContent}
                postId={postId}
                setComments={setComments}
              />
            </li>
          ))
        : !hasMore && <h3 className="text-lg text-gray-400">No comments</h3>}
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
