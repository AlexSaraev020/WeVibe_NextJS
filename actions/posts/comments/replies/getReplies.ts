import { RepliesType } from "@/types/post/comments/replies/repliesType";
import axios from "axios";

interface GetRepliesProps {
  postId: string;
  commentId: string;
  skip: number;
  setSkip: (updateSkip: (prevSkip: number) => number) => void;
  limit: number;
  setLoading: (loading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
}
export const getReplies = async ({
  postId,
  commentId,
  setSkip,
  setHasMore,
  setLoading,
  skip,
  limit,
}: GetRepliesProps) => {
  try {
    const response = await axios.post(`/api/posts/commentReplies/getReplies`, {
      postId,
      commentId,
      skip,
      limit,
    });
    if (response.status < 300 && Array.isArray(response.data.replies)) {
      setLoading(false);
      setSkip((prevSkip) => prevSkip + limit);
      setHasMore(response.data.hasMore);
      return response.data.replies as RepliesType[];
    }
    setHasMore(false);
    return [];
  } catch (error: unknown) {
    setLoading(false);
    setHasMore(false);
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error adding comment:", error);
  }
};
