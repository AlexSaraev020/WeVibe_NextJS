import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface loginUserProps {
  email: string;
  password: string;
  setMessage: (message: string | undefined) => void;
  router: AppRouterInstance;
  setError: (error: boolean) => void;
}
export const loginUser = async ({
  email,
  password,
  setMessage,
  setError,
  router,
}: loginUserProps) => {
  try {
    const response = await axios.post("/api/auth/login", { email, password });
    if (response.status === 200) {
      setError(false);
      setMessage(response.data.message);
      router.push("/home");
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("Server response error:", error.response.data.message);
      setMessage(error.response.data.message);
      setError(true);
      return error.response.data.message;
    }
    console.error("Error following:", error);
  }
};
