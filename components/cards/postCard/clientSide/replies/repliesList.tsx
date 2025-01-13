import { RepliesType } from "@/types/post/comments/replies/repliesType";
import React, { useEffect } from "react";
import ReplyCard from "./replyCard";
interface RepliesListProps {
  replies: RepliesType[];
  showReplies: boolean;
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
  setPage,
  setReplies,
}: RepliesListProps) {
  return (
    <>
      {showReplies && (
        <ul className="flex w-11/12 flex-col items-center justify-center gap-2 pt-2">
          {replies.map((reply: RepliesType) => (
            <ReplyCard setReplies={setReplies} reply={reply} key={reply._id} />
          ))}
          <div className="flex w-full justify-start">
            {hasMore && replies.length > 0 && (
              <button
                type="button"
                aria-label="MoreRepliesButton"
                id="moreRepliesButton"
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
