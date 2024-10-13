import axios from "axios";

export const getComments = async (postId: string) => {
  try {
    const response = await axios.post("/api/posts/comments/get", { postId });
    if (response.status < 300) {
      return response.data.comments;
    }
    return [];
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error fetching comments:", error);
    return [];
  }
};
