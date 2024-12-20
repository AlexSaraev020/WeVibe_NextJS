import { ImageType } from "@/types/image/imageType";
import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface CreatePostProps {
  title: string;
  description: string;
  image: ImageType | undefined;
  setMessage: (message: string | undefined) => void;
  setError: (erorr: boolean) => void;
  router: AppRouterInstance;
  setShowCreatePost: (showCreatePost: boolean) => void;
  setDisabled: (disabled: boolean) => void;
}

export const createPost = async ({
  title,
  description,
  image,
  router,
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
      router.refresh();
    }
    return null;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("Server response error:", error.response.data.message);
      setMessage(error.response.data.message);
      setError(true);
      return error.response.data.message;
    }
    console.error("Error following:", error);
  }
};
