import axios from "axios";
interface DeleteCommentProps{
    commentId: string
    postId: string
    setAddedCommentCounter: (
        updateCounter: (prevCounter: number) => number,
      ) => void;
}

export const deleteComment = async({commentId, postId, setAddedCommentCounter}: DeleteCommentProps) =>{
    try {
        const response = await axios.patch(`/api/posts/comments/deletion/delete`,{
            commentId,
            postId
        });
        if(response.status < 300){
            setAddedCommentCounter((prevCounter) => prevCounter - 1);
        }
        return;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        console.error("Error following:", error);
        
    }
}