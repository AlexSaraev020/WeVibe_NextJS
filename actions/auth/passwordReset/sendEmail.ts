import axios from "axios";

interface SendEmailProps {
  email: string | null;
  setMessage: (message: string | undefined) => void;
  setEmailSent: (emailSent: boolean) => void;
  setError: (error: boolean) => void;
}
export const sendEmail = async ({
  email,
  setMessage,
  setEmailSent,
  setError,
}: SendEmailProps) => {
  try {
    const response = await axios.post("/api/auth/resetPassword/sendEmail", {
      email,
    });
    if (response.status === 200) {
      setError(false);
      setMessage(response.data.message);
      setEmailSent(true)
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      setMessage(error.response.data.message);
      setError(true);
      return error.response.data.message;
    }
    console.error("Error following:", error);
  }
};
