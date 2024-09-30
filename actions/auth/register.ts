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

    if (response.status === 200) {
      setSuccess(response.data.message);
      setFailure(undefined);
      router.push("/");
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      setFailure(error.response.data.message);
      setSuccess(undefined);
    } else {
      setFailure("An unexpected error occurred.");
    }
  }
};

