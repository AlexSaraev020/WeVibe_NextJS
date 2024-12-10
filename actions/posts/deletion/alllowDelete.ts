import axios from "axios";
interface AllowDeleteProps {
  postId: string;
  setAllow: (allow: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export async function allowDelete({ postId, setAllow , setLoading }: AllowDeleteProps) {
  try {
    const response = await axios.post(`/api/posts/deletion/allowDelete`, {
      postId
    });
    if (response.status < 300) {
      setLoading(false);
      setAllow(response.data.allow);
    }
    setLoading(false);
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("Server response error:", error.response.data.message);
      return error.response.data.message;
    }
    console.error("Error following:", error);
  }
}
