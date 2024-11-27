import axios from "axios";

interface VerifyResetCodeProps {
  code: string;
  setMessage: (message: string | undefined) => void;
  setEmailSent: (emailSent: boolean) => void;
  setCodeVerified: (codeVerified: boolean) => void;
  setError: (error: boolean) => void;
}

export const verifyResetCode = async ({
  code,
  setMessage,
  setEmailSent,
  setError,
  setCodeVerified,
}: VerifyResetCodeProps) => {
  try {
    const response = await axios.post(
      "/api/auth/resetPassword/verifyResetCode",
      { code },
    );
    if (response.status === 200) {
      setError(false)
      setMessage(response.data.message);
      setEmailSent(false);
      setCodeVerified(true);
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("Server response error:", error.response.data.message);
      setMessage(error.response.data.message);
      setError(true);
      return error.response.data.message;
    }
    console.error("Error following:", error);
  }
};
