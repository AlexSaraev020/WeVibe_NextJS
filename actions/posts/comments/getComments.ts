import { CommentType } from "@/types/post/postType";
import axios from "axios";
interface GetCommentsProps {
  postId: string;
  setLoading: (loading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  setSkip:(updateSkip: (prevSkip: number) => number) => void;
  skip: number;
  limit: number;
}
export const getComments = async ({
  postId,
  skip,
  setHasMore,
  limit,
  setSkip,
  setLoading,
}: GetCommentsProps) => {
  try {
    const response = await axios.post("/api/posts/comments/get", {
      postId,
      skip,
      limit,
    });
    if (response.status < 300 && Array.isArray(response.data.comments)) {
      setLoading(false);
      setSkip((prevSkip) => prevSkip + limit);
      setHasMore(response.data.hasMore);
      return response.data.comments as CommentType[];
    }
    setHasMore(false);
    return [];
  } catch (error: unknown) {
    setLoading(false);
    setHasMore(false);
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error fetching comments:", error);
    return [];
  }
};
