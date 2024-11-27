import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface RegisterProps {
  userName: string;
  email: string;
  password: string;
  setMessage: (message: string | undefined) => void;
  router: AppRouterInstance;
  setError:(error:boolean)=>void
}

export const registerUser = async ({
  userName,
  email,
  password,
 setError,
  setMessage,
  router,
}: RegisterProps) => {
  try {
    const response = await axios.post("/api/auth/register", {
      username: userName,
      email,
      password,
    });

    if (response.status === 200) {
      setError(false)
      setMessage(response.data.message);
      router.push("/");
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("Server response error:", error.response.data.message);
      setMessage(error.response.data.message);
      setError(true)
      return error.response.data.message;
    }
    console.error("Error following:", error);
  }
};

