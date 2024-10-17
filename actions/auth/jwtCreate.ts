import { CompactEncrypt } from "jose";
import { createHash } from "crypto";

const secret = process.env.JWT_PRIVATE;

if (!secret) {
  throw new Error("JWT_PRIVATE is not defined");
}
const secretKey = createHash("sha256").update(secret).digest();
export const generateToken = async (userId: string) => {
  const payload = {
    userId,
    iat: Math.floor(Date.now() / 1000),
  };

  const jwe = await new CompactEncrypt(
    new TextEncoder().encode(JSON.stringify(payload))
  )
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .encrypt(secretKey);

  return jwe;
};
