import { PostType } from "@/types/post/postType";
import axios from "axios";
interface GetPostsProps {
  skip: number;
  setHasMore: (hasMore: boolean) => void;
  setSkip: (updateSkip: (prevSkip: number) => number) => void;
  setLoading: (loading: boolean) => void;
  limit: number;
}

export const getPosts = async ({
  skip,
  limit = 3,
  setHasMore,
  setSkip,
  setLoading,
}: GetPostsProps) => {
  try {
    const response = await axios.post(`/api/posts/get`, {
      skip,
      limit,
    });
    if (response.status < 300 && Array.isArray(response.data.posts)) {
      setLoading(false);
      setSkip((prevSkip) => prevSkip + limit);
      setHasMore(response.data.hasMore);
      return response.data.posts as PostType[];
    }
    setHasMore(false);
    return [];
  } catch (error: unknown) {
    setLoading(false);
    setHasMore(false);
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error fetching posts:", error);
    return [];
  }
};
