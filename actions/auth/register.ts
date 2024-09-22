import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface RegisterProps {
  userName: string;
  email: string;
  password: string;
  setSuccess: React.Dispatch<React.SetStateAction<string | undefined>>;
  setFailure: React.Dispatch<React.SetStateAction<string | undefined>>;
  router: AppRouterInstance;
}

export const registerUser = async ({
  userName,
  email,
  password,
  setSuccess,
  setFailure,
  router,
}: RegisterProps) => {
  try {
    const response = await axios.post("/api/auth/register", {
      username: userName,
      email,
      password,
    });
    if (response.status < 300) {
      setFailure(undefined);
      setSuccess(response.data.message);
      router.push("/");
    } else {
      setSuccess(undefined);
      setFailure(response.data.message);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      setSuccess(undefined);
      setFailure(`An error occurred while registering. ${error.message}`);
      console.error("Registration error:", error);
    } else {
      setSuccess(undefined);
      setFailure(`An unknown error occurred while registering.`);
      console.error("Registration error:", error);
    }
  }
};
