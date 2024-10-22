"use server";
import { createHash } from 'crypto';
import { jwtDecrypt } from 'jose';

export const jwtDecode = async (token: string) => {
    const secret = process.env.JWT_PRIVATE;
    if (!secret) {
        throw new Error("JWT_PRIVATE is not defined");
    }

    const secretKey = createHash('sha256').update(secret).digest(); // 32 bytes

    const { payload } = await jwtDecrypt(token, secretKey);
    if (!payload || typeof payload !== 'object' || !('userId' in payload)) {
        throw new Error("Invalid token payload");
    }
    return {
        userId: payload.userId as string,
        iat: payload.iat as number,
    };
};
