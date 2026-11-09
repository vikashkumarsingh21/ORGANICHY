import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_COOKIE_NAME = "organichy_auth_token";

interface DecodedToken {
  userId: string;
  email: string;
  role: "CUSTOMER" | "ADMIN" | "STAFF";
  exp: number;
}

function parseTokenPayload(token: string): DecodedToken | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const parsed = JSON.parse(jsonPayload);

    // Check expiration
    if (parsed.exp && parsed.exp * 1000 < Date.now()) {
      return null;
    }

    return parsed;
  } catch (e) {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(TOKEN_COOKIE_NAME)?.value;
  const decoded = token ? parseTokenPayload(token) : null;

  // 1. Protect Customer Portal (/account)
  if (pathname.startsWith("/account")) {
    if (!decoded) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Protect Admin Portal (/admin/*)
  // Exclude /admin/login from blocking
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!decoded) {
      const adminLoginUrl = new URL("/admin/login", req.url);
      adminLoginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(adminLoginUrl);
    }

    // Explicit check: Customers must NEVER access admin areas
    if (decoded.role !== "ADMIN") {
      const adminLoginUrl = new URL("/admin/login", req.url);
      adminLoginUrl.searchParams.set("error", "unauthorized_role");
      return NextResponse.redirect(adminLoginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/account",
    "/admin/:path*",
  ],
};

