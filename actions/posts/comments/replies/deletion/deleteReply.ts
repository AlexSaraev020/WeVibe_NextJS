import { RepliesType } from "@/types/post/comments/replies/repliesType";
import axios from "axios";

interface DeleteReplyProps {
  replyId: string;
  commentId: string;
  setReplies: (
    updateReplies: (prevReplies: RepliesType[]) => RepliesType[],
  ) => void;
}
export const deleteReply = async ({
  replyId,
  commentId,
  setReplies,
}: DeleteReplyProps) => {
  try {
    await axios.patch(`/api/posts/commentReplies/deletion/delete`, {
      replyId,
      commentId,
    });
    setReplies((prev) => prev.filter((reply) => reply._id !== replyId));
    return;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error following:", error);
  }
};
