import { PostType } from "@/types/post/postType";
import axios from "axios";
interface GetPostsProps {
  limit: number;
  /** ids the visitor has already been shown, so the server can sample the rest */
  seen?: string[];
  setHasMore: (hasMore: boolean) => void;
  setLoading: (loading: boolean) => void;
  setNewDeck?: (newDeck: boolean) => void;
}

export const getPosts = async ({
  limit,
  seen = [],
  setHasMore,
  setLoading,
  setNewDeck,
}: GetPostsProps) => {
  try {
    const response = await axios.post(`/api/posts/get`, { limit, seen });
    if (response.status < 300 && Array.isArray(response.data.posts)) {
      setLoading(false);
      setHasMore(response.data.hasMore);
      setNewDeck?.(Boolean(response.data.newDeck));
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
