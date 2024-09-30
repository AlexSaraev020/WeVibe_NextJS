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
    setFailure("All fields are required.");
    setSuccess(undefined);
    return;
  }
  try {
    const response = await axios.post("/api/auth/login", { email, password });
    if (response.status === 200) {
      setSuccess(response.data.message);
      setFailure(undefined);
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
