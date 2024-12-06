import axios from "axios";

interface ReplyCommentProps {
  postId: string;
  commentId: string;
  reply: string;
  setAddedReplyCounter: (updateCounter:(prevCounter: number) => number) => void;
  setReply: (reply: string) => void;
  setShowReplyField: (showReplyField: boolean) => void
}

export const replyComment = async ({
  postId,
  commentId,
  setShowReplyField,
  reply,
  setAddedReplyCounter,
  setReply,
}: ReplyCommentProps) => {
    setReply('');
  try {
    const response = await axios.put(`/api/posts/commentReplies/reply`, {
      postId,
      commentId,
      reply,
    });
    if (response.status < 300) {
        setAddedReplyCounter((prevCounter) => prevCounter + 1);
        setShowReplyField(false);
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error adding comment:", error);
  }
};
