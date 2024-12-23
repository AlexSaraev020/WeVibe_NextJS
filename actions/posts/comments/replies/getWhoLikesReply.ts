import { UserType } from "@/types/userTypes/user/userType";
import axios from "axios";

interface GetWhoLikedReplyProps {
  replyId: string;
  skip: number;
  limit: number;
  setLoading: (loading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  setSkip: (updateSkip: (prevSkip: number) => number) => void;
}

export const getWhoLikedReply = async ({
  replyId,
  skip,
  setHasMore,
  setSkip,
  limit,
  setLoading,
}: GetWhoLikedReplyProps) => {
  try {
    const response = await axios.post(
      "/api/posts/commentReplies/getWhoLikedReply",
      {
        replyId,
        skip,
        limit,
      },
    );
    if (response.status < 300 && Array.isArray(response.data.likes)) {
      setLoading(false);
      setSkip((prevSkip) => prevSkip + limit);
      setHasMore(response.data.hasMore);
      return response.data.likes as UserType[];
    }
    return;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error adding comment:", error);
  }
};
