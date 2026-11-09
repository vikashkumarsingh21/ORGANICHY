/**
 * Sanitize plain text to prevent Stored & Reflected XSS
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validate standard email format
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate Indian 10-digit mobile number (starts with 6, 7, 8, or 9)
 */
export function isValidIndianPhone(phone: string): boolean {
  if (!phone || typeof phone !== "string") return false;
  const cleaned = phone.replace(/[^0-9]/g, "");
  // Allow +91 prefix or direct 10-digit number
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return /^[6-9]\d{9}$/.test(cleaned.slice(2));
  }
  return /^[6-9]\d{9}$/.test(cleaned);
}

/**
 * Validate Indian 6-digit postal code (PIN code)
 */
export function isValidIndianPincode(pincode: string): boolean {
  if (!pincode || typeof pincode !== "string") return false;
  const cleaned = pincode.trim().replace(/\D/g, "");
  return /^[1-9][0-9]{5}$/.test(cleaned);
}

/**
 * Validate safe password strength (min 8 chars)
 */
export function isValidPassword(password: string): { valid: boolean; message?: string } {
  if (!password || password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters long." };
  }
  return { valid: true };
}

/**
 * Sanitize and enforce positive numeric quantities
 */
export function sanitizeQuantity(qty: any, min = 1, max = 24): number {
  const parsed = parseInt(qty, 10);
  if (isNaN(parsed) || parsed < min) return min;
  if (parsed > max) return max;
  return parsed;
}

