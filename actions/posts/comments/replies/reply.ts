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
}

export const replyComment = async ({
  postId,
  setRepliesNumber,
  commentId,
  setShowReplyField,
  setShowReplies,
  reply,
  setReplies,
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
      setReplies((prev) => [response.data.reply, ...prev]);
      setShowReplies(true);
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error adding comment:", error);
  }
};
