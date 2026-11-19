import { createHash } from "crypto";
import { jwtDecrypt } from "jose";

/* the token check without the "use server" boundary: a server component cannot call a Server
   Action while rendering, and it must not write cookies either, so the decoding lives here and
   actions/auth/jwtDecode stays a thin wrapper over it for the route handlers that already use it */
export const verifyAuthToken = async (token: string) => {
  const secret = process.env.JWT_PRIVATE;
  if (!secret) {
    throw new Error("JWT_PRIVATE is not defined");
  }
  const secretKey = createHash("sha256").update(secret).digest();
  const { payload } = await jwtDecrypt(token, secretKey);
  if (!payload || !payload.value) {
    throw new Error("Invalid token payload");
  }
  return payload.value as string;
};
