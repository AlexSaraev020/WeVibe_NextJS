import axios from "axios";

interface HandleLikeProps{
    postId: string;
    setLike: (like: boolean) => void
    like: boolean | undefined
    setLikes: (updateLikes: (prevLikes: number) => number) => void
}

export const handleLike = async ({ postId , setLike , setLikes, like}: HandleLikeProps) => {
  try {
    /* an unknown state used to be skipped here, so a card that never learned whether it
       was liked already incremented on every click and never filled the heart */
    const wasLiked = like ?? false;
    setLike(!wasLiked);
    setLikes((prevLikes: number) => (wasLiked ? prevLikes - 1 : prevLikes + 1));
    await axios.patch(`/api/posts/handleLike`, { postId });
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error adding comment:", error);
  }
};
