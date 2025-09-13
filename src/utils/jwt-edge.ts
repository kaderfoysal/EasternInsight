import { jwtVerify, JWTPayload } from 'jose';

// Define a custom interface for our JWT payload
interface CustomJWTPayload extends JWTPayload {
  id: string;
  role: string;
  name?: string;
  email?: string;
}

// Use the global TextEncoder (built-in in Edge runtime)
export async function verifyTokenEdge(token: string, secret: string): Promise<CustomJWTPayload | null> {
  try {
    const encoder = new TextEncoder(); // no import from 'util'
    const secretKey = encoder.encode(secret);
    const { payload } = await jwtVerify(token, secretKey);
    return payload as CustomJWTPayload;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.substring(7);
}