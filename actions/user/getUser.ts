import axios from "axios";

const url = process.env.NEXT_PUBLIC_API_URL;
export const getUser = async () => {
  try {
    const response = await axios.get("/api/user/get");
    return response.data;
  } catch (error: unknown) {
    console.error(error);
    return error;
  }
};

export const getUserById = async (userId: string) => {
  try {
    const response = await axios.get(`${url}/api/user/getById`, {
      params: { userId },
    });
    return response.data;
  } catch (error: unknown) {
    console.error(error);
    return error;
  }
};

export const getUsersByQuery = async (query: string) => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await axios.get(`${url}/api/user/search?q=${query}`);
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching users:", error);
    return error;
  }
};
