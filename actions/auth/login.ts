import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface loginUserProps {
  email: string;
  password: string;
  setMessage: (message: string | undefined) => void;
  setShowAlert: (showAlert: boolean) => void;
  router: AppRouterInstance;
}
export const loginUser = async ({
  email,
  password,
  setMessage,
  setShowAlert,
  router,
}: loginUserProps) => {
  if (!email || !password) {
    setMessage("All fields are required.");
    setShowAlert(true);
    return;
  }
  try {
    const response = await axios.post("/api/auth/login", { email, password });
    if (response.status === 200) {
      setMessage(undefined);
      sessionStorage.setItem("isLoggedIn", "Logged In!");
      setShowAlert(false);
      router.push("/home");
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
