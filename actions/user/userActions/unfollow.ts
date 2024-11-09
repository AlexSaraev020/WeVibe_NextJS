import axios from "axios";

export const unfollowUser = async (query: string) => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await axios.post(`/api/user/unfollow`, { query });
    console.log(response);
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error following:", error);
  }
};
