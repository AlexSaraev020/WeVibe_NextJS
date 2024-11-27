import { jwtDecode } from "@/actions/auth/jwtDecode";
import { cookies } from "next/headers";

export const checkUserLoggedIn = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken");
    if (!token) {
        return false;
    }
    try {
        const decodedToken = await jwtDecode(token.value);
        return decodedToken;
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message);
        }
        console.error(error);
        return false;
    }
}