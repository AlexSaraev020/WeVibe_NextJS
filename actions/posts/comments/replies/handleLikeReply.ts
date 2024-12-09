import axios from "axios";

interface HandleLikeReplyProps {
  _id: string;
  setLikes: (updateLikes: (prevLikes: number) => number) => void;
  liked: boolean | undefined;
  setLiked: (liked: boolean | undefined) => void;
}

export const handleLikeReply = async ({
  _id,
  setLikes,
  setLiked,
  liked,
}: HandleLikeReplyProps) => {
  setLiked(!liked);
  setLikes((prevLikes: number) => (!liked ? prevLikes + 1 : prevLikes - 1));
  try {
    await axios.put("/api/posts/commentReplies/handleLikeReply", {
      _id,
    });
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error adding comment:", error);
  }
};
