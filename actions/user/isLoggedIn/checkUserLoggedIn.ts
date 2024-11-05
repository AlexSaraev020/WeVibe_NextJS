import { jwtDecode } from "@/actions/auth/jwtDecode";
import { DecodedToken } from "@/types/userTypes/token/decoded";
import { cookies } from "next/headers";

export const checkUserLoggedIn = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken");
    console.log("token: ",token?.value);
    if (!token) {
        return false;
    }
    try {
        const payload = (await jwtDecode(token.value)) as DecodedToken;
        const userId = payload.userId;
        return userId;
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message);
        }
        console.error(error);
        return false;
    }
}