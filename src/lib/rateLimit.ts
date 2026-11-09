import { NextRequest, NextResponse } from "next/server";

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((record, key) => {
      if (now > record.resetTime) {
        rateLimitStore.delete(key);
      }
    });
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  maxRequests?: number;
  windowSeconds?: number;
  windowMs?: number;
  keyPrefix?: string;
}

export interface RateLimitResult {
  success: boolean;
  isAllowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
  retryAfterSeconds: number;
}

/**
 * Flexible sliding window rate limit checker
 * Supports both positional args `checkRateLimit(key, max, windowSec)`
 * and options object `checkRateLimit(key, { maxRequests, windowMs })`
 */
export function checkRateLimit(
  key: string,
  arg2?: number | RateLimitOptions,
  arg3?: number
): RateLimitResult {
  let maxRequests = 30;
  let windowSeconds = 60;

  if (typeof arg2 === "number") {
    maxRequests = arg2;
    if (typeof arg3 === "number") {
      windowSeconds = arg3;
    }
  } else if (arg2 && typeof arg2 === "object") {
    if (typeof arg2.maxRequests === "number") {
      maxRequests = arg2.maxRequests;
    }
    if (typeof arg2.windowMs === "number") {
      windowSeconds = Math.ceil(arg2.windowMs / 1000);
    } else if (typeof arg2.windowSeconds === "number") {
      windowSeconds = arg2.windowSeconds;
    }
  }

  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return {
      success: true,
      isAllowed: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      resetSeconds: windowSeconds,
      retryAfterSeconds: windowSeconds,
    };
  }

  if (record.count >= maxRequests) {
    const remainingSeconds = Math.ceil((record.resetTime - now) / 1000);
    return {
      success: false,
      isAllowed: false,
      limit: maxRequests,
      remaining: 0,
      resetSeconds: Math.max(remainingSeconds, 1),
      retryAfterSeconds: Math.max(remainingSeconds, 1),
    };
  }

  record.count += 1;
  const remainingSeconds = Math.ceil((record.resetTime - now) / 1000);

  return {
    success: true,
    isAllowed: true,
    limit: maxRequests,
    remaining: maxRequests - record.count,
    resetSeconds: Math.max(remainingSeconds, 1),
    retryAfterSeconds: Math.max(remainingSeconds, 1),
  };
}

/**
 * Extract client IP from NextRequest safely
 */
export function getClientIp(req: NextRequest): string {
  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  const xRealIp = req.headers.get("x-real-ip");
  if (xRealIp) {
    return xRealIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Standard 429 Too Many Requests response builder
 */
export function rateLimitExceededResponse(resetSeconds: number) {
  return NextResponse.json(
    {
      success: false,
      error: `Too many requests. Please wait ${resetSeconds} seconds before trying again.`,
    },
    {
      status: 429,
      headers: {
        "Retry-After": resetSeconds.toString(),
      },
    }
  );
}
