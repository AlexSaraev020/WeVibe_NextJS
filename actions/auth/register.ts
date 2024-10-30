import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface RegisterProps {
  userName: string;
  email: string;
  password: string;
  setFailure: (failure: string | undefined) => void;
  router: AppRouterInstance;
}

export const registerUser = async ({
  userName,
  email,
  password,
  setFailure,
  router,
}: RegisterProps) => {
  try {
    const response = await axios.post("/api/auth/register", {
      username: userName,
      email,
      password,
    });

    if (response.status === 200) {
      setFailure(undefined);
      router.push("/");
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      setFailure(error.response.data.message);
    } else {
      setFailure("An unexpected error occurred.");
    }
  }
};

