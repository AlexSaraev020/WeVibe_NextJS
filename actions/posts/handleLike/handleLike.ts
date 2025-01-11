import axios from "axios";

interface HandleLikeProps{
    postId: string;
    setLike: (like: boolean) => void
    like: boolean | undefined
    setLikes: (updateLikes: (prevLikes: number) => number) => void
}

export const handleLike = async ({ postId , setLike , setLikes, like}: HandleLikeProps) => {
  try {
    if (like !== undefined) {
      setLike(!like);
    }
    setLikes((prevLikes: number) => (!like ? prevLikes + 1 : prevLikes - 1));
    await axios.patch(`/api/posts/handleLike`, { postId });
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error adding comment:", error);
  }
};
