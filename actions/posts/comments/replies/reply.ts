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
}

export const replyComment = async ({
  postId,
  setRepliesNumber,
  commentId,
  setShowReplyField,
  reply,
  setReplies,
  setReply,
}: ReplyCommentProps) => {
  setReply("");
  try {
    const response = await axios.put(`/api/posts/commentReplies/reply`, {
      postId,
      commentId,
      reply,
    });
    setReplies((prev) => [response.data.reply, ...prev]);

    if (response.status < 300) {
      setShowReplyField(false);
      setRepliesNumber((prev) => prev + 1);
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error adding comment:", error);
  }
};
