import { PostType } from "@/types/post/postType";
import axios from "axios";

interface GetProfilePostsProps {
  userId: string;
  setLoading: (loading: boolean) => void;
  skip: number;
  limit: number;
}

export const getProfilePosts = async ({
  userId,
  setLoading,
  skip,
  limit,
}: GetProfilePostsProps) => {
  try {
    const response = await axios.post(
      `/api/user/profile/getProfilePosts?user=${userId}`,
      { skip, limit },
    );
    if (response.status < 300) {
      setLoading(false);
      return response.data.posts
    }
    return [];
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error fetching user profile:", error);
    return error;
  }
};
