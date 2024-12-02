import { PostType } from "@/types/post/postType";
import axios from "axios";

interface GetProfilePostsProps {
    userId: string;
    setPosts: (posts: PostType[]) => void
}

export const getProfilePosts = async ({ userId, setPosts }: GetProfilePostsProps) => {
  try {
    const response = await axios.get(
      `/api/user/profile/getProfilePosts?user=${userId}`,
    );
    if (response.status < 300) {
      setPosts(response.data.posts);
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
