import axios from "axios";

interface ChooseAnotherEmailProps {
  setMessage: (message: string | undefined) => void;
  setError: (error: boolean) => void;
  setEmailSent: (emailSent: boolean) => void;
  setResetCode: (resetCode: string[]) => void;
}

export const chooseAnotherEmail = async ({
  setMessage,
  setEmailSent,
  setResetCode,
  setError,
}: ChooseAnotherEmailProps) => {
  try {
    const response = await axios.delete(
      "/api/auth/resetPassword/chooseAnotherEmail",
    );
    if (response.status < 300) {
      setResetCode(["", "", "", "", "", ""]);
      setEmailSent(false);
      setError(false);
      setMessage(response.data.message);
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      setError(true);
      setMessage(error.response.data.message);
      return error.response.data;
    }
    console.error("Error following:", error);
  }
};
