import axios from "axios";

export const logoutUser = async () => {
  try {
    const response = await axios.post(`/api/user/profile/logout`);
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error logging out:", error);
  }
};
