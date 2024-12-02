"use client";
import axios from "axios";

interface AllowFollowingProps {
  userId: string;
  setAllow?: (allow: string) => void;
}

export const allowFollowing = async ({userId, setAllow}: AllowFollowingProps) => {
  try {
    const response = await axios.get(
      `/api/user/profile/allowFollowing?user=${userId}`
    );
    if(response.status < 300) {
      setAllow && setAllow(response.data.allow)
    }
    return response
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error following:", error);
  }
};
