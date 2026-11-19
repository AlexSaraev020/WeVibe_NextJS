"use server";
import { verifyAuthToken } from "@/lib/auth/verifyAuthToken";

/* kept as a Server Action because the reset-password routes import it; the decoding itself
   lives in lib/auth/verifyAuthToken so page components can use it too */
export const jwtDecode = async (token: string) => verifyAuthToken(token);
