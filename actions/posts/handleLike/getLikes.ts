import axios from "axios";
interface GetLikesProps {
  postId: string;
  setLike: (like: boolean) => void;
}

export const getLikes = async ({ postId, setLike }: GetLikesProps) => {
  try {
    const response = await axios.post("/api/posts/getLikes", { postId });
    if (response.status < 300) {
      setLike(response.data.isLiked);
    }
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error adding comment:", error);
  }
};
