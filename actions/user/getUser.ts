import axios from "axios";

export const getUser = async (userId: string) => {
  const response = await axios.get(`/api/user/get/${userId}`, {
    params: { userId },
  });
  return response.data;
};
