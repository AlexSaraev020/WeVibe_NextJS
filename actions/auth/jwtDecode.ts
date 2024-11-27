"use server";
import { createHash } from "crypto";
import { jwtDecrypt } from "jose";

export const jwtDecode = async (token: string) => {
  const secret = process.env.JWT_PRIVATE;
  if (!secret) {
    throw new Error("JWT_PRIVATE is not defined");
  }

  const secretKey = createHash("sha256").update(secret).digest();

  const { payload } = await jwtDecrypt(token, secretKey);
  if (!payload) {
    throw new Error("Invalid token payload");
  }
  return payload.value as string;
};
