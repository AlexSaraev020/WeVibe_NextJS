import { ImageType } from "@/types/image/imageType";
import { PostType } from "@/types/post/postType";
import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface CreatePostProps {
  title: string;
  description: string;
  image: ImageType | undefined;
  setMessage: (message: string | undefined) => void;
  setError: (erorr: boolean) => void;
  setShowCreatePost: (showCreatePost: boolean) => void;
  setDisabled: (disabled: boolean) => void;
  setPosts: (updatePosts: (prevPosts: PostType[]) => PostType[]) => void;
}

export const createPost = async ({
  setPosts,
  title,
  description,
  image,
  setDisabled,
  setShowCreatePost,
  setMessage,
  setError,
}: CreatePostProps) => {
  try {
    setDisabled(true);
    const response = await axios.post("/api/posts/create", {
      title,
      description,
      image,
    });
    if (response.status < 300) {
      setError(false);
      setMessage(response.data.message);
      setShowCreatePost(false);
      setPosts((prevPosts) => [response.data.post, ...prevPosts]);
    }
    return null;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      setMessage(error.response.data.message);
      setError(true);
      setDisabled(false);
      return error.response.data.message;
    }
    console.error("Error following:", error);
  }
};
