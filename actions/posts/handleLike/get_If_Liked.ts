import axios from "axios";
interface GetLikesProps {
  postId: string;
  setLike: (like: boolean) => void;
  setLikes: (likes: number) => void;
}

export const getLikes = async ({ postId, setLike , setLikes }: GetLikesProps) => {
  try {
    const response = await axios.post("/api/posts/getIfLiked", { postId });
    if (response.status < 300) {
      setLike(response.data.isLiked);
      setLikes(response.data.likes.length);
    }
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error adding comment:", error);
  }
};
