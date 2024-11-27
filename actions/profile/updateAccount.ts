import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface UpdateAccountProps {
  email: string;
  password: string;
  router: AppRouterInstance;
  setEdit: (edit: boolean) => void;
  setMessage: (message: string | undefined) => void;
  setShowAlert: (showAlert: boolean) => void;
}

export const updateAccount = async ({
  email,
  password,
  router,
  setEdit,
  setMessage,
  setShowAlert,
}: UpdateAccountProps) => {
  try {
    const response = await axios.put("/api/user/update/account", {
      email,
      password,
    });
    if (response.status === 200) {
      setEdit(false);
      setMessage(response.data.message);
      setShowAlert(false);
      router.push("/home");
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data.message;
    }
    console.error("Error in updating account:", error);
  }
};
