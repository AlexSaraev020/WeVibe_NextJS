import axios from "axios";

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
