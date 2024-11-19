import axios from "axios";

interface HandleLikeProps{
    postId: string;
}

export const handleLike = async ({ postId}: HandleLikeProps) => {
  try {
    await axios.put(`/api/posts/handleLike`, { postId });
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error adding comment:", error);
  }
};
