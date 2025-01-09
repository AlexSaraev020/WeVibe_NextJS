import axios from "axios";

interface SendEmailProps {
  email: string | null;
  setMessage: (message: string | undefined) => void;
  setEmailSent: (emailSent: boolean) => void;
  setError: (error: boolean) => void;
  setEmail: (email: string | null) => void;
}
export const sendEmail = async ({
  email,
  setMessage,
  setEmailSent,
  setEmail,
  setError,
}: SendEmailProps) => {
  try {
    const response = await axios.post("/api/auth/resetPassword/sendEmail", {
      email,
    });
    
    if (response.status === 200) {
      setEmail(null);
      setError(false);
      setEmailSent(true)
      setMessage(response.data.message);
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
