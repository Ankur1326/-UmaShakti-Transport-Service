import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";
export const ADMIN_COOKIE_NAME = process.env.COOKIE_NAME ?? "admin_session";

export interface AdminTokenPayload {
  adminId: string;
  email: string;
}

function getSecret(): string {
  if (!JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is not set. Copy .env.example to .env.local and provide a secret."
    );
  }
  return JWT_SECRET;
}

/** Sign a short-lived JWT for an authenticated admin. */
export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: JWT_EXPIRES_IN });
}

/** Verify and decode an admin JWT. Throws if invalid/expired. */
export function verifyAdminToken(token: string): AdminTokenPayload {
  return jwt.verify(token, getSecret()) as AdminTokenPayload;
}