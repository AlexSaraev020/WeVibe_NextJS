import axios from "axios";
import { getUser } from "../../user/searchUser";
import { CommentType } from "@/types/post/comments/commentsType";

interface AddCommentProps {
  postId: string;
  comment: string;
  setComments: (
    updateComments: (prevComments: CommentType[]) => CommentType[],
  ) => void;
  setComment: (comment: string) => void;
  setMessage: (message: string | undefined) => void;
  setError: (error: boolean) => void;
}

export const addComment = async ({
  postId,
  comment,
  setComment,
  setComments,
  setMessage,
  setError,
}: AddCommentProps) => {
  setComment("");
  try {
    const response = await axios.patch(`/api/posts/comments/create`, {
      postId,
      comment,
    });
    if (response.status < 300) {
      setComments((prev: CommentType[]) => [response.data.comment, ...prev]);
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
