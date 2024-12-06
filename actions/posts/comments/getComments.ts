import { CommentType } from "@/types/post/postType";
import axios from "axios";
interface GetCommentsProps {
  postId: string;
  setLoading: (loading: boolean) => void;
  setComments: (comments: CommentType[]) => void;
}
export const getComments = async ({
  postId,
  setLoading,
  setComments,
}: GetCommentsProps) => {
  try {
    const response = await axios.post("/api/posts/comments/get", { postId });
    if (response.status < 300) {
      console.log(response.data.comments);
      setLoading(false);
      setComments(response.data.comments);
    } else {
      setLoading(false);
      setComments([] as CommentType[]);
    }
    return response;
  } catch (error: unknown) {
    setLoading(false);
    setComments([] as CommentType[]);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 204) {
        setComments([] as CommentType[]);
        return;
      }
      return error.response.data;
    }
    console.error("Error fetching comments:", error);
    return [];
  }
};
