import axios from "axios";

const url = process.env.NEXT_PUBLIC_API_URL;
export const getUser = async () => {
  try {
    const response = await axios.get("/api/user/get");
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      return error.message;
    }
  }
};

export const getUserById = async (userId: string) => {
  try {
    const response = await axios.get(`${url}/api/user/getById`, {
      params: { userId },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      return error.message;
    }
  }
};
