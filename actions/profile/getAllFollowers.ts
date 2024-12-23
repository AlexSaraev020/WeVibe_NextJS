import axios from "axios";

interface GetFollowersProps {
  setLoading: (loading: boolean) => void;
  skip: number;
  limit: number;
  userId: string;
}

export const getAllFollowers = async ({
  skip,
  limit,
  setLoading,
  userId,
}: GetFollowersProps) => {
  try {
    const response = await axios.post(
      `/api/user/profile/getAllFollowerUsers?user=${userId}`,
      { skip, limit },
    );
    if (response.status < 300) {
      setLoading(false);
      return response.data.userProfileFollowersSliced;
    }
    return [];
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error following:", error);
  }
};
