import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access-secret-dev";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh-secret-dev";
const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || "15m";
const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || "7d";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export const authService = {
  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign({ ...payload, jti: randomUUID() }, ACCESS_SECRET, {
      expiresIn: ACCESS_EXPIRY,
    });
  },

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign({ ...payload, jti: randomUUID() }, REFRESH_SECRET, {
      expiresIn: REFRESH_EXPIRY,
    });
  },

  verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
  },

  verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
  },

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  },

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },

  generateResetToken(): string {
    return randomUUID();
  },

  generateTokenPair(payload: TokenPayload) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  },
};
