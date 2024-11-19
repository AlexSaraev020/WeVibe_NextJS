import axios from "axios";
interface AllowDeleteProps {
  userId: string;
  setAllow: (allow: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export async function allowDelete({ userId, setAllow , setLoading }: AllowDeleteProps) {
  try {
    const response = await axios.post(`/api/posts/deletion/allowDelete`, {
      createdBy: userId,
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
