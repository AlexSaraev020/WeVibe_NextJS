import { UserType } from "@/types/userTypes/user/userType";
import axios from "axios";

interface GetFollowersProps {
  setLoading: (loading: boolean) => void;
  skip: number;
  limit: number;
  userId: string;
  setHasMore: (hasMore: boolean) => void;
  setSkip: (updateSkip: (prevSkip: number) => number) => void;
}

export const getAllFollowers = async ({
  skip,
  setHasMore,
  setSkip,
  limit,
  setLoading,
  userId,
}: GetFollowersProps) => {
  try {
    const response = await axios.post(
      `/api/user/profile/getAllFollowerUsers?user=${userId}`,
      { skip, limit },
    );
    if (response.status < 300 && Array.isArray(response.data.users)) {
      setLoading(false);
      setSkip((prevSkip) => prevSkip + limit);
      setHasMore(response.data.hasMore);
      return response.data.users as UserType[];
    }
    return [];
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error following:", error);
  }
};
