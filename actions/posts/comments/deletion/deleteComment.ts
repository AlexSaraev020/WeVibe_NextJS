import { CommentType } from "@/types/post/comments/commentsType";
import axios from "axios";
interface DeleteCommentProps {
  commentId: string;
  postId: string;
  setComments: (
    updateComments: (prevComments: CommentType[]) => CommentType[],
  ) => void;
}

export const deleteComment = async ({
  commentId,
  postId,
  setComments,
}: DeleteCommentProps) => {
  try {
    await axios.patch(`/api/posts/comments/deletion/delete`, {
      commentId,
      postId,
    });

    setComments((prev) => prev.filter((comment) => comment._id !== commentId));

    return;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error following:", error);
  }
};
