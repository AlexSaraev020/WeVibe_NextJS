import { cookies } from "next/headers";

export const checkIsGuest = async () => {
    const cookieStore = await cookies();
    const isGuest = cookieStore.get("isGuest");
    if (!isGuest) {
        return false;
    }
    return isGuest.value;
}