import { UserType } from "@/types/userTypes/user/userType";
import axios from "axios";

interface SeeWhoLikedProps {
  postId: string;
  skip: number;
  limit: number;
  setLoading: (loading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  setSkip: (updateSkip: (prevSkip: number) => number) => void;
}
export const seeWhoLiked = async ({
  postId,
  setHasMore,
  setLoading,
  setSkip,
  skip,
  limit,
}: SeeWhoLikedProps) => {
  try {
    const response = await axios.post(`/api/posts/seePeopleWhoLiked`, {
      postId,
      skip,
      limit,
    });
    console.log("users", response.data.users);
    console.log("hasMore", response.data.hasMore);
    
    if (response.status < 300 && Array.isArray(response.data.users)) {
      setLoading(false);
      setSkip((prevSkip) => prevSkip + limit);
      setHasMore(response.data.hasMore);
      return response.data.users as UserType[];
    }
    setHasMore(false);
    return [];
  } catch (error: unknown) {
    setLoading(false);
    setHasMore(false);
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error adding comment:", error);
  }
};
