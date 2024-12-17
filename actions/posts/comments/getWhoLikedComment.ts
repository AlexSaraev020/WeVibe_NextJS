import { UserType } from "@/types/userTypes/user/userType";
import axios from "axios";
interface GetWhoLikedCommentProps {
  commentId: string;
  setUserList: (userList: UserType[]) => void;
  setLoading: (loading: boolean) => void;
}
export const getWhoLikedComment = async ({
  commentId,
  setUserList,
  setLoading,
}: GetWhoLikedCommentProps) => {
  try {
    const response = await axios.post(
      "/api/posts/comments/getWhoLikedComment",
      {
        commentId,
      },
    );
    if (response.status < 300) {
      setLoading(false);
      setUserList(response.data.comment.likes);
    }
    return;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error adding comment:", error);
  }
};
