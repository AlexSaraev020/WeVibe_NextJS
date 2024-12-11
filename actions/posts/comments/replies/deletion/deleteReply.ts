import axios from "axios";

interface DeleteReplyProps {
  replyId: string;
  commentId: string;
  setAddedReplyCounter: (
    updateCounter: (prevCounter: number) => number,
  ) => void;
}
export const deleteReply = async ({
  replyId,
  commentId,
  setAddedReplyCounter,
}: DeleteReplyProps) => {
  try {
    const response = await axios.patch(
      `/api/posts/commentReplies/deletion/delete`,
      {
        replyId,
        commentId,
      },
    );
    if (response.status < 300) {
        setAddedReplyCounter((prevCounter) => prevCounter - 1);
    }
    return;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error following:", error);
  }
};
