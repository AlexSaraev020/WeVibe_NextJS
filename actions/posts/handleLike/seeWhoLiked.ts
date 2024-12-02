import { UserType } from "@/types/userTypes/user/userType";
import axios from "axios";

interface SeeWhoLikedProps {
  postId: string;
  setWhoLiked: (whoLiked: UserType[]) => void;
  setLoading: (loading: boolean) => void;
}
export const seeWhoLiked = async ({ postId , setWhoLiked , setLoading }: SeeWhoLikedProps) => {
  try {
    const response = await axios.post(`/api/posts/seePeopleWhoLiked`, {
      postId,
    });
    if (response.status < 300) {
      setLoading(false);
      setWhoLiked(response.data.peopleWhoLiked.likes);
    }
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error adding comment:", error);
  }
};
