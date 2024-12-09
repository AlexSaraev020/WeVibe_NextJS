import axios from "axios";

interface GetIfLikedProps {
    _id: string;
    setLiked: (liked: boolean) => void;
}
export const getIfLikedReply = async({_id, setLiked}: GetIfLikedProps) =>{
    try {
        const response = await axios.post("/api/posts/commentReplies/getIfLikedReply", {
            _id,
        });
        if (response.status < 300) {
            setLiked(response.data.isLiked);
        }
        return;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        console.error("Error adding comment:", error);
        
    }
}