import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface UpdatePasswordProps {
  password: string | null;
  setMessage: (message: string | undefined) => void;
  setError: (error: boolean) => void;
  router: AppRouterInstance;
}
export const updatePassword = async ({
  password,
  setError,
  setMessage,
  router,
}: UpdatePasswordProps) => {
  try {
    const response = await axios.post(
      "/api/auth/resetPassword/updatePassword",
      { password },
    );
    console.log("triggered");
    console.log(response);
    if (response.status < 300) {
      setError(false);
      setMessage(response.data.message);
      router.push("/login");
    }
    setError(true);
    setMessage(response.data.message);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      setError(true);
      setMessage(error.response.data.message);
      return error.response.data;
    }
    console.error("Error following:", error);
  }
};
