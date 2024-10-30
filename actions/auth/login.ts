import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface loginUserProps {
  email: string;
  password: string;
  setFailure: (failure: string | undefined) => void;
  router: AppRouterInstance;
}
export const loginUser = async ({
  email,
  password,
  setFailure,
  router,
}: loginUserProps) => {
  if (!email || !password) {
    setFailure("All fields are required.");
    return;
  }
  try {
    const response = await axios.post("/api/auth/login", { email, password });
    if (response.status === 200) {
      setFailure(undefined);
      sessionStorage.setItem("isLoggedIn", "Logged In!");
      router.push("/home");
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      setFailure(error.response.data.message);
    } else {
      setFailure("An unexpected error occurred.");
    }
  }
};
