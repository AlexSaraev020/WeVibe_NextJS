import { RepliesType } from "@/types/post/comments/replies/repliesType";
import axios from "axios";

interface ReplyCommentProps {
  postId: string;
  commentId: string;
  reply: string;
  setReply: (reply: string) => void;
  setShowReplyField: (showReplyField: boolean) => void;
  setReplies: (
    updateReplies: (prevReplies: RepliesType[]) => RepliesType[],
  ) => void;
  setRepliesNumber: (
    updateRepliesNumber: (prevRepliesNumber: number) => number,
  ) => void;
  setShowReplies: (showReplies: boolean) => void;
  replies: RepliesType[];
  setMessage: (message: string | undefined) => void;
  setError: (error: boolean) => void;
}

export const replyComment = async ({
  postId,
  setRepliesNumber,
  commentId,
  setShowReplyField,
  setShowReplies,
  reply,
  setMessage,
  setError,
  setReplies,
  replies,
  setReply,
}: ReplyCommentProps) => {
  setReply("");
  try {
    const response = await axios.patch(`/api/posts/commentReplies/reply`, {
      postId,
      commentId,
      reply,
    });

    if (response.status < 300) {
      setShowReplyField(false);
      setRepliesNumber((prev) => prev + 1);
      if (replies.length > 0) {
        setReplies((prev: RepliesType[]) => [response.data.reply, ...prev]);
      }
      setShowReplies(true);
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      setError(true);
      setMessage(error.response.data.message);
      return error.response.data;
    }
    console.error("Error adding comment:", error);
  }
};
