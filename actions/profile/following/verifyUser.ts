import axios from "axios";

interface VerifyUserProps {
  query: string;
  verified: boolean;
}

export const verifyUser = async ({ query, verified }: VerifyUserProps) => {
  try {
    const response = await axios.post(`/api/user/profile/verify`, { query, verified });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error verifying account:", error);
  }
};
