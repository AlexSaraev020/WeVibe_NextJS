import { PostType } from "@/types/post/postType";
import axios from "axios";


interface GetProfilePostsProps {
  userId: string;
  setLoading: (loading: boolean) => void;
  skip: number;
  limit: number;
  setSkip: (updateSkip: (prevSkip: number) => number) => void;
  setHasMore: (hasMore: boolean) => void;
}

export const getProfilePosts = async ({
  userId,
  setLoading,
  setSkip,
  setHasMore,
  skip,
  limit,
}: GetProfilePostsProps) => {
  try {
    const response = await axios.post(
      `/api/user/profile/getProfilePosts?user=${userId}`,
      { skip, limit },
    );
    if (response.status < 300 && Array.isArray(response.data.posts)) {
      setLoading(false);
      setSkip((prevSkip) => prevSkip + limit);
      setHasMore(response.data.hasMore);
      return response.data.posts as PostType[];
    }
    return [] as PostType[];
  } catch (error: unknown) {

    if (axios.isAxiosError(error) && error.response) {
      return error.response.data.message;
    }
    console.error("Error fetching user profile:", error);
    return error;
  }
};
