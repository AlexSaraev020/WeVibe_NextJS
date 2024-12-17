import { UserType } from "@/types/userTypes/user/userType";
import axios from "axios";

interface GetWhoLikedReplyProps {
  replyId: string;
  setUserList: (userList: UserType[]) => void;
  setLoading: (loading: boolean) => void;
}

export const getWhoLikedReply = async ({
  replyId,
  setUserList,
  setLoading,
}: GetWhoLikedReplyProps) => {
    try {
        const response = await axios.post(
            "/api/posts/commentReplies/getWhoLikedReply",
            {
                replyId,
            },
        );
        if (response.status < 300) {
            setLoading(false);
            setUserList(response.data.reply.likes);
        }
        return;
        
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        console.error("Error adding comment:", error);
        
    }
};
