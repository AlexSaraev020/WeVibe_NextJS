import axios from "axios";

interface GetIfLikedProps {
  commentId: string;
  postId: string;
  setLiked: (liked: boolean) => void;
}

export const getIfLiked = async ({
  commentId,
  postId,
  setLiked,
}: GetIfLikedProps) => {
  try {
    const response = await axios.post("/api/posts/comments/getIfLikedComment", {
      commentId,
      postId,
    });
    if (response.status < 300) {
      setLiked(response.data.isLiked);
    }
    return;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error adding comment:", error);
  }
};
