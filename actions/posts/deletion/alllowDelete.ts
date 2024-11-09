import axios from "axios";
interface AllowDeleteProps {
  userId: string;
  setAllow: (allow: boolean) => void;
}

export async function allowDelete({ userId, setAllow }: AllowDeleteProps) {
  try {
    const response = await axios.post(`/api/posts/deletion/allowDelete`, {
      createdBy: userId,
    });
    if (response.status < 300) {
      setAllow && setAllow(response.data.allow);
    }
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("Server response error:", error.response.data.message);
      return error.response.data.message;
    }
    console.error("Error following:", error);
  }
}
