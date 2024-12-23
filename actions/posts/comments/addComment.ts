import axios from "axios";
import { getUser } from "../../user/searchUser";

interface AddCommentProps {
  postId: string;
  comment: string;
  setComment: (comment: string) => void;
  setAddedCommentCounter: (updateCounter:(prevCounter: number) => number) => void;
}

export const addComment = async ({ postId, comment, setComment, setAddedCommentCounter }: AddCommentProps) => {
  setComment("");
  try {
    const userResponse = await getUser();
    const userId = userResponse.user._id;
    const response = await axios.put(`/api/posts/comments/create`, {
      postId,
      comment,
      userId,
    });

    if (response.status < 300) {
      setAddedCommentCounter((prevCounter) => prevCounter + 1);
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error adding comment:", error);
  }
};
