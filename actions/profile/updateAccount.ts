import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface UpdateAccountProps {
  email: string;
  password: string;
  setEdit: (edit: boolean) => void;
  setMessage: (message: string | undefined) => void;
  searchedUser: string;
  setError: (error: boolean) => void;
  router: AppRouterInstance;
}

export const updateAccount = async ({
  email,
  searchedUser,
  password,
  setError,
  setEdit,
  setMessage,
  router,
}: UpdateAccountProps) => {
  try {
    const response = await axios.patch(`/api/user/profile/update/account?user=${searchedUser}`, {
      email,
      password,
    });
    if (response.status === 200) {
      router.push("/");
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
