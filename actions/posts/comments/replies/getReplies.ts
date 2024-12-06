import { RepliesType } from "@/types/post/comments/replies/repliesType";
import axios from "axios";

interface GetRepliesProps {
  postId: string;
  commentId: string;
  setReplies: (replies: RepliesType[]) => void;
}
export const getReplies = async ({ postId, commentId, setReplies }: GetRepliesProps) => {
  try {
    const response = await axios.post(`/api/posts/commentReplies/getReplies`, {
      postId,
      commentId,
    });
    if (response.status < 300) {
      setReplies(response.data.replies);
    }
    return [];
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error adding comment:", error);
  }
};
