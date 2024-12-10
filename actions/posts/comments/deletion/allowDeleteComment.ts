import axios from "axios";

interface AllowDeleteCommentProps {
  commentId: string;
  setAllow: (allow: boolean) => void;
  setLoading: (loading: boolean) => void;
}
export const allowDeleteComment = async ({
  commentId,
  setAllow,
  setLoading,
}: AllowDeleteCommentProps) => {
  try {
    const response = await axios.post(`/api/posts/comments/deletion/allowDelete`, {
      commentId,
    });
    if (response.status < 300) {
      setLoading(false);
      setAllow(response.data.allow);
    }
    return;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error following:", error);
  }
};
