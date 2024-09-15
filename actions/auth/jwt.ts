import * as jwt from 'jsonwebtoken';

const secret = process.env.JWT_PRIVATE;

if (!secret) {
    throw new Error('JWT_PRIVATE environment variable is not set');
  }
export const generateToken = (userId: string) => {
    return jwt.sign({ userId }, secret, { expiresIn: '1d' });
}