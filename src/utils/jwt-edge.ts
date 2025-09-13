import { jwtVerify } from 'jose';

// Use the global TextEncoder (built-in in Edge runtime)
export async function verifyTokenEdge(token: string, secret: string): Promise<any> {
  try {
    const encoder = new TextEncoder(); // no import from 'util'
    const secretKey = encoder.encode(secret);

    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.substring(7);
}
