import { RepliesType } from "@/types/post/comments/replies/repliesType";
import React from "react";
import ReplyCard from "./replyCard";
interface RepliesListProps {
  replies: RepliesType[];
  showReplies: boolean;
  commentContent: {
    replies: number;
  };
  setReplies: (
    updateReplies: (prevReplies: RepliesType[]) => RepliesType[],
  ) => void;
  setPage: (updatePage: (prevPage: number) => number) => void;
  hasMore: boolean;
}

export default function RepliesList({
  replies,
  hasMore,
  showReplies,
  commentContent,
  setPage,
  setReplies,
}: RepliesListProps) {
  return (
    <>
      {replies.length > 0 && showReplies && commentContent.replies > 0 && (
        <ul className="flex w-11/12 flex-col items-center justify-center gap-2 pt-2">
          {replies.map((reply: RepliesType) => (
            <ReplyCard setReplies={setReplies} reply={reply} key={reply._id} />
          ))}
          <div className="flex w-full justify-start">
            {hasMore && (
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="text-xs italic text-gray-400 md:text-sm"
              >
                More replies...
              </button>
            )}
          </div>
        </ul>
      )}
    </>
  );
}
