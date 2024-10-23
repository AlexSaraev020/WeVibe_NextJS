import axios from "axios";

const url = process.env.NEXT_PUBLIC_API_URL;
export const getUserProfile = async (userId: string) => {
  try {
    const response = await axios.get(
      `${url}/api/user/getUserProfile?user=${userId}`
    );

    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error fetching user profile:", error);
    return error;
  }
};
