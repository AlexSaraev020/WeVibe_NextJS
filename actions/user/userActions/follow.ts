import axios from "axios";

export const followUser = async (userId: string) => {
    const url = process.env.NEXT_PUBLIC_API_URL;
    try {
        const response = await axios.get(`${url}/api/user/follow?user=${userId}`);
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        console.error("Error following:", error);
    }
};