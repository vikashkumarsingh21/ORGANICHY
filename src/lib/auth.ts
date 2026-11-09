import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "organichy_super_secure_jwt_secret_key_moradabad_2026";
const TOKEN_COOKIE_NAME = "organichy_auth_token";
const TOKEN_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days

export interface AuthUserPayload {
  userId: string;
  email: string;
  name: string;
  role: Role;
}

/**
 * Hash plain text password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify plain text password against stored hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Sign JWT token for authenticated user
 */
export function signAuthToken(payload: AuthUserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Verify JWT token and extract payload
 */
export function verifyAuthToken(token: string): AuthUserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUserPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Set HTTP-Only authentication cookie
 */
export function setAuthCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_EXPIRY_SECONDS,
  });
}

/**
 * Clear authentication cookie on logout
 */
export function clearAuthCookie() {
  const cookieStore = cookies();
  cookieStore.set(TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Retrieve active user session from incoming request (Cookie or Bearer header)
 */
export async function getSessionUser(req?: NextRequest): Promise<AuthUserPayload | null> {
  let token: string | undefined;

  // 1. Try Bearer header
  if (req) {
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  // 2. Try Cookies
  if (!token) {
    try {
      const cookieStore = cookies();
      token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
    } catch {
      if (req) {
        token = req.cookies.get(TOKEN_COOKIE_NAME)?.value;
      }
    }
  }

  if (!token) return null;

  return verifyAuthToken(token);
}

/**
 * Role-Based Access Control Guard
 */
export async function requireAuth(req?: NextRequest): Promise<AuthUserPayload> {
  const user = await getSessionUser(req);
  if (!user) {
    throw new Error("UNAUTHORIZED: Authentication required to access this resource.");
  }
  return user;
}

export async function requireAdmin(req?: NextRequest): Promise<AuthUserPayload> {
  const user = await requireAuth(req);
  if (user.role !== "ADMIN") {
    throw new Error("FORBIDDEN: Administrative privileges required.");
  }
  return user;
}

/**
 * Generate cryptographically signed Password Reset Token (1-hour validity)
 */
export function generatePasswordResetToken(email: string): string {
  return jwt.sign(
    { email: email.toLowerCase().trim(), type: "ORGANICHY_PASSWORD_RESET" },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

/**
 * Verify Password Reset Token
 */
export function verifyPasswordResetToken(token: string): { email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; type: string };
    if (decoded && decoded.type === "ORGANICHY_PASSWORD_RESET" && decoded.email) {
      return { email: decoded.email };
    }
    return null;
  } catch {
    return null;
  }
}

