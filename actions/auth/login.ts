import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface loginUserProps {
  email: string;
  password: string;
  setSuccess: React.Dispatch<React.SetStateAction<string | undefined>>;
  setFailure: React.Dispatch<React.SetStateAction<string | undefined>>;
  router: AppRouterInstance;
}
export const loginUser = async ({
  email,
  password,
  setSuccess,
  setFailure,
  router,
}: loginUserProps) => {
  if (!email || !password) {
    setFailure("Email și parola sunt necesare.");
    return;
  }
  try {
    const response = await axios.post("/api/auth/login", { email, password });
    if (response.status < 300) {
      setFailure(undefined);
      setSuccess(response.data.message);
      router.push("/home");
    } else {
      setSuccess(undefined);
      setFailure(response.data.message || "An error occurred while logging in.");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      setSuccess(undefined);
      setFailure(`An error occurred while logging in. ${error.message}`);
      console.error("Login error:", error);
    } else {
      setSuccess(undefined);
      setFailure(`An unknown error occurred while logging in.`);
      console.error("Login error:", error);
    }
  }
};
