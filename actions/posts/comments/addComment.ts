import axios from "axios";
import { getUser } from "../../user/getUser";

export const addComment = async (postId: string, comment: string) => {
  try {
    const userId = await getUser();
    const url = process.env.NEXT_PUBLIC_API_URL;
    const response = await axios.put(`${url}/api/posts/comments/create`, {
      postId,
      comment,
      userId,
    });

    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error adding comment:", error);
  }
};
