import { PostType } from "@/types/post/postType";
import axios from "axios";
interface GetInitialPostsProps {
  setPosts: (updatePosts: (prevPosts: PostType[]) => PostType[]) => void;
}

export const getInitialPosts = async ({ setPosts }: GetInitialPostsProps) => {
  try {
    const response = await axios.post("/api/posts/get", {
      skip: 0,
      limit: 3,
    });
    if (response.status < 300 && Array.isArray(response.data.posts)) {
      setPosts((prevPosts) => [...response.data.posts, ...prevPosts]);
      return response.data.posts as PostType[];
    }
    return [];
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error adding comment:", error);
  }
};
