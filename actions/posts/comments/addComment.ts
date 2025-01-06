import axios from "axios";
import { getUser } from "../../user/searchUser";
import { CommentType } from "@/types/post/comments/commentsType";

interface AddCommentProps {
  postId: string;
  comment: string;
  setComments: (updateComments: (prevComments: CommentType[]) => CommentType[]) => void;
  setComment: (comment: string) => void;
}

export const addComment = async ({ postId, comment, setComment ,setComments }: AddCommentProps) => {
  setComment("");
  try {
    const userResponse = await getUser();
    const userId = userResponse.user._id;
    const response = await axios.put(`/api/posts/comments/create`, {
      postId,
      comment,
      userId,
    });

    if (response.status < 300 ) {
      console.log("response.data.comment", response.data.comment);
      setComments((prev) => [response.data.comment, ...prev]);
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error adding comment:", error);
  }
};
