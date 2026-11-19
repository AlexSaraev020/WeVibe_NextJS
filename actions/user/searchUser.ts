import axios from "axios";

/* client-side only: an absolute NEXT_PUBLIC_API_URL pins the app to one origin, so opening it
   as localhost while the value is a LAN address makes every people/search call a CORS failure */
export const getUser = async () => {
  try {
    const response = await axios.get("/api/user/get");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response;
    }
    console.error("Error fetching user:", error);
    return error;
  }
};

export const getUsersByQuery = async (query: string) => {
  try {
    const response = await axios.get(`/api/user/searchUser?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error fetching users:", error);
    return error;
  }
};
