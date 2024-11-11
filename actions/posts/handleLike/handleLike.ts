import axios from "axios";

interface HandleLikeProps{
    postId: string;
    setLike: (like: boolean) => void;
}

export const handleLike = async ({ postId , setLike}: HandleLikeProps) => {
  try {
    const response = await axios.put(`/api/posts/handleLike`, { postId });
    if(response.status < 300) {
        setLike(response.data.like)
    }
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error adding comment:", error);
  }
};
