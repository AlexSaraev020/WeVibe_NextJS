import axios from "axios";

interface HandleLikeCommentProps{
    commentId: string
    postId: string
    setLikes: (updateLikes: (prevLikes: number) => number) => void
    liked: boolean | undefined
    setLiked: (liked: boolean | undefined) => void
}
export const handleLikeComment = async ({commentId, postId, setLikes, setLiked, liked}: HandleLikeCommentProps) => {
    try {
        setLiked(!liked);
        setLikes((prevLikes: number) => (!liked ? prevLikes + 1 : prevLikes - 1));
        await axios.put(`/api/posts/comments/handleLikeComment`, {
            commentId,
            postId,
        });
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        console.error("Error adding comment:", error);
    }

}