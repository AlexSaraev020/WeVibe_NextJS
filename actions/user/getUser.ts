import axios from "axios";

const url = process.env.NEXT_PUBLIC_API_URL;
export const getUser = async () => {
  try {
    const response = await axios.get("/api/user/get");
    return response.data.user;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.status;
    }
    console.error("Error fetching user:", error);
    return error;
  }
};

export const getUsersByQuery = async (query: string) => {
  try {
    const response = await axios.get(`${url}/api/user/search?q=${query}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error fetching users:", error);
    return error;
  }
};
