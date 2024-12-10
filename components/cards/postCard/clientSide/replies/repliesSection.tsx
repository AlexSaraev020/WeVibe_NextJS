import { replyComment } from "@/actions/posts/comments/replies/reply";
import Textarea from "@/components/forms/formElements/textarea";
import React, { useEffect, useState } from "react";
import { LuSend } from "react-icons/lu";
import { MdKeyboardArrowDown } from "react-icons/md";
import ReplyCard from "./replyCard";
import { RepliesType } from "@/types/post/comments/replies/repliesType";
import { getReplies } from "@/actions/posts/comments/replies/getReplies";

interface RepliesSectionProps {
  commentContent: {
    _id: string;
    replies: number;
  };
  postId: string;
}

export default function RepliesSection({
  commentContent,
  postId,
}: RepliesSectionProps) {
  const [showReplyField, setShowReplyField] = useState<boolean>(false);
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [replies, setReplies] = useState<RepliesType[]>([]);
  const [reply, setReply] = useState<string>("");
  const [addedReplyCounter, setAddedReplyCounter] = useState<number>(
    commentContent.replies,
  );
  const handleSubmitReply = async () => {
    await replyComment({
      postId,
      commentId: commentContent._id,
      reply,
      setAddedReplyCounter,
      setReply,
      setShowReplyField,
    });
  };

  useEffect(() => {
    if (showReplies && addedReplyCounter > 0) {
      (async () => {
        await getReplies({ postId, commentId: commentContent._id, setReplies });
      })();
    }
  }, [addedReplyCounter, showReplies, commentContent._id]);
  return (
    <div className="flex w-full flex-col items-end">
      <div className="flex w-11/12 items-center justify-start gap-4">
        <button
          onClick={() => setShowReplyField(!showReplyField)}
          className="text-xs italic text-white/60 md:text-sm"
        >
          Reply
        </button>
        {addedReplyCounter > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-end text-xs italic text-white/60 md:text-sm"
          >
            {showReplies ? "Hide replies" : "Show replies"}
            <MdKeyboardArrowDown className="h-4 w-4" />
          </button>
        )}
      </div>
      {showReplyField && (
        <div className="mt-1 flex w-11/12 items-center justify-start gap-2">
          <Textarea
            name="reply comment"
            className="py-0 md:py-[0.2rem]"
            id="reply comment"
            value={reply}
            placeHolder="Reply..."
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setReply(e.target.value)
            }
            rows={1}
            minLength={1}
            maxLength={2000}
            ariaLabel="Reply comment"
          />
          <button
            onClick={handleSubmitReply}
            className="group flex h-6 items-center justify-center transition-all duration-500 hover:scale-110"
          >
            <LuSend className="h-5 w-6 animate-appear transition-all duration-500 group-hover:text-postBackground/70" />
          </button>
        </div>
      )}
      {addedReplyCounter > 0 && showReplies && (
        <ul className="w-11/12 pt-2 flex flex-col gap-2">
          {replies.map((reply: RepliesType) => (
            <ReplyCard reply={reply} key={reply._id} />
          ))}
        </ul>
      )}
    </div>
  );
}
