import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface RegisterProps {
  userName: string;
  email: string;
  password: string;
  setMessage: (message: string | undefined) => void;
  setShowAlert: (showAlert: boolean) => void;
  router: AppRouterInstance;
}

export const registerUser = async ({
  userName,
  email,
  password,
  setShowAlert,
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
      setMessage(undefined);
      setShowAlert(false);
      router.push("/");
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      setMessage(error.response.data.message);
      setShowAlert(true);
    } else {
      setMessage("An unexpected error occurred.");
      setShowAlert(true);
    }
  }
};

