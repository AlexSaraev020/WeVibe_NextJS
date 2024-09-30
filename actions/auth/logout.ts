import axios from "axios";

export const logoutUser = async () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await axios.get(`${url}/api/user/logout`);
    return response;
  } catch (error: unknown) {
    console.error("Error logging out:", error);
  }
};
