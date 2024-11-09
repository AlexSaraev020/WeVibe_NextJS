import axios from "axios";

interface DeletePostProps {
  postId: string;
  createdBy: string;
}

export const deletePost = async ({ postId, createdBy }: DeletePostProps) => {
  try {
    const response = await axios.post(`/api/posts/deletion/delete`, {
      postId,
      createdBy,
    });
    if (response.status < 300) {
      return response.data.message;
    }
    return response.data.message;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("Server response error:", error.response.data.message);
      return error.response.data.message;
    }
    console.error("Error following:", error);
  }
};
