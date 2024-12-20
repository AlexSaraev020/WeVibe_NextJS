import { UserType } from "@/types/userTypes/user/userType";
import axios from "axios";

interface SeeWhoLikedProps {
  postId: string;
  setUserList: (userList: UserType[]) => void;
  setLoading: (loading: boolean) => void;
}
export const seeWhoLiked = async ({ postId , setUserList , setLoading }: SeeWhoLikedProps) => {
  try {
    const response = await axios.post(`/api/posts/seePeopleWhoLiked`, {
      postId,
    });
    if (response.status < 300) {
      setLoading(false);
      setUserList(response.data.peopleWhoLiked.likes);
    }
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error adding comment:", error);
  }
};
