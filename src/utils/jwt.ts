// utils/jwt.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';
const TOKEN_EXPIRATION = '7d';

export interface UserJwtPayload {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'WRITER' | 'EDITOR' | 'ADMIN';
}

export function generateToken(user: UserJwtPayload): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
}

export function verifyToken(token: string): UserJwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserJwtPayload;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}