import { jwtDecode } from "@/actions/auth/jwtDecode";
import { cookies } from "next/headers";

export const checkUserLoggedIn = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken");
  const failedAttemptsCookie = cookieStore.get("failedAttempts");
  let failedAttempts = failedAttemptsCookie
    ? parseInt(failedAttemptsCookie.value, 10)
    : 0;
  if (!token) {
    return false;
  }
  try {
    const decodedToken = await jwtDecode(token.value);
    cookieStore.set("failedAttempts", "0");
    return decodedToken;
  } catch (error: unknown) {
    failedAttempts++;
    if (error instanceof Error) {
      console.error(error.message);
    }
    console.error(error);
    if (failedAttempts >= 3) {
      cookieStore.delete("authToken");
      cookieStore.set("failedAttempts", "0");
    } else {
      cookieStore.set("failedAttempts", failedAttempts.toString());
    }
    return false;
  }
};
