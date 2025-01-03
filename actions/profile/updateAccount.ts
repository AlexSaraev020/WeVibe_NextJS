import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface UpdateAccountProps {
  email: string;
  password: string;
  router: AppRouterInstance;
  setEdit: (edit: boolean) => void;
  setMessage: (message: string | undefined) => void;
  setError: (error: boolean) => void;
}

export const updateAccount = async ({
  email,
  password,
  router,
  setError,
  setEdit,
  setMessage,
}: UpdateAccountProps) => {
  try {
    const response = await axios.put("/api/user/profile/update/account", {
      email,
      password,
    });
    if (response.status === 200) {
      setError(false);
      setEdit(false);
      setMessage(response.data.message);
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      setError(true);
      setMessage(error.response.data.message);
      return error.response.data.message;
    }
    console.error("Error in updating account:", error);
  }
};
