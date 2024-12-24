import { UserType } from "@/types/userTypes/user/userType";
import axios from "axios";
interface GetWhoLikedCommentProps {
  commentId: string;
  skip: number;
  limit: number;
  setHasMore: (hasMore: boolean) => void;
  setSkip: (updateSkip: (prevSkip: number) => number) => void;
  setLoading: (loading: boolean) => void;
}
export const getWhoLikedComment = async ({
  commentId,
  skip,
  limit,
  setHasMore,
  setSkip,
  setLoading,
}: GetWhoLikedCommentProps) => {
  console.log("called");
  try {
    const response = await axios.post(
      "/api/posts/comments/getWhoLikedComment",
      {
        commentId,
        skip,
        limit,
      },
    );
    console.log("users", response.data.users);
    console.log("hasMore", response.data.hasMore);
    if (response.status < 300 && Array.isArray(response.data.users)) {
      setLoading(false);
      setSkip((prevSkip) => prevSkip + limit);
      setHasMore(response.data.hasMore);
      return response.data.users as UserType[];
    }
    setHasMore(false);
    return;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error adding comment:", error);
  }
};
