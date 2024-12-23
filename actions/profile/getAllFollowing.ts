import axios from "axios";

interface GetFollowersProps {
  setLoading: (loading: boolean) => void;
  userId: string;
  skip: number;
  limit: number;
}

export const getAllFollowing = async ({
  setLoading,
  skip,
  limit,
  userId,
}: GetFollowersProps) => {
  try {
    const response = await axios.post(
      `/api/user/profile/getAllFollowingUsers?user=${userId}`,
      { skip, limit },
    );
    if (response.status < 300) {
      setLoading(false);
      return response.data.userProfileFollowingSliced;
    }
    return [];
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error following:", error);
  }
};
