import axios from "axios";

interface AllowDeleteReplyProps {
  _id: string;
  setAllow: (allow: boolean) => void;
  setLoading: (loading: boolean) => void;
}
export const allowDeleteReply = async ({
  _id,
  setAllow,
  setLoading,
}: AllowDeleteReplyProps) => {
  try {
    const response = await axios.post(
      `/api/posts/commentReplies/deletion/allowDelete`,
      { _id },
    );
    if (response.status < 300) {
      setLoading(false);
      setAllow(response.data.allow);
    }
    return;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error following:", error);
  }
};
