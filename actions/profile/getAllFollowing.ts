import { UserType } from "@/types/userTypes/user/userType";
import axios from "axios";

interface GetFollowersProps {
  setUsers: (followers: UserType[]) => void;
  setLoading: (loading: boolean) => void;
  userId: string;
}

export const getAllFollowing = async ({
  setUsers,
  setLoading,
  userId,
}: GetFollowersProps) => {
  try {
    const response = await axios.get(
      `/api/user/profile/getAllFollowingUsers?user=${userId}`,
    );
    if (response.status < 300) {
      setUsers(response.data.userProfileFollowing.following);
      setLoading(false);
    }
    return [];
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error following:", error);
  }
};