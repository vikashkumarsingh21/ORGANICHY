/**
 * Standardized Input Validation & Sanitization Engine for ORGANICHY Backend
 * Zero-dependency robust validators with detailed error payloads
 */

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
}

// Regular expressions for Indian E-Commerce validations
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INDIAN_PHONE_REGEX = /^(?:\+91|91)?[6-9]\d{9}$/;
const INDIAN_PINCODE_REGEX = /^[1-9][0-9]{5}$/;

/**
 * Clean & sanitize text input (strips unwanted script tags & trims)
 */
export function sanitizeString(val: unknown): string {
  if (typeof val !== "string") return "";
  return val.trim().replace(/[<>]/g, "");
}

/**
 * Validate User Registration Payload
 */
export function validateRegisterInput(data: any): ValidationResult<{
  name: string;
  email: string;
  password: string;
  phone?: string;
}> {
  const errors: Record<string, string> = {};
  const name = sanitizeString(data?.name);
  const email = sanitizeString(data?.email).toLowerCase();
  const password = typeof data?.password === "string" ? data.password : "";
  const phone = data?.phone ? sanitizeString(data.phone) : undefined;

  if (!name || name.length < 2) {
    errors.name = "Full name must be at least 2 characters long.";
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    errors.email = "Please provide a valid email address.";
  }

  if (!password || password.length < 6) {
    errors.password = "Password must be at least 6 characters long.";
  }

  if (phone && !INDIAN_PHONE_REGEX.test(phone.replace(/[\s-]/g, ""))) {
    errors.phone = "Please provide a valid 10-digit Indian phone number.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: { name, email, password, phone },
  };
}

/**
 * Validate User Login Payload
 */
export function validateLoginInput(data: any): ValidationResult<{
  email: string;
  password: string;
}> {
  const errors: Record<string, string> = {};
  const email = sanitizeString(data?.email).toLowerCase();
  const password = typeof data?.password === "string" ? data.password : "";

  if (!email || !EMAIL_REGEX.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: { email, password },
  };
}

/**
 * Validate Address Payload
 */
export function validateAddressInput(data: any): ValidationResult<{
  fullName: string;
  phoneNumber: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}> {
  const errors: Record<string, string> = {};

  const fullName = sanitizeString(data?.fullName);
  const phoneNumber = sanitizeString(data?.phoneNumber).replace(/[\s-]/g, "");
  const street = sanitizeString(data?.street);
  const landmark = data?.landmark ? sanitizeString(data.landmark) : undefined;
  const city = sanitizeString(data?.city);
  const state = sanitizeString(data?.state);
  const postalCode = sanitizeString(data?.postalCode);
  const country = sanitizeString(data?.country) || "India";
  const isDefault = Boolean(data?.isDefault);

  if (!fullName || fullName.length < 2) {
    errors.fullName = "Recipient name is required.";
  }

  if (!phoneNumber || !INDIAN_PHONE_REGEX.test(phoneNumber)) {
    errors.phoneNumber = "A valid 10-digit Indian mobile number is required.";
  }

  if (!street || street.length < 5) {
    errors.street = "Street address / House number must be detailed (min 5 chars).";
  }

  if (!city) {
    errors.city = "City is required.";
  }

  if (!state) {
    errors.state = "State is required.";
  }

  if (!postalCode || !INDIAN_PINCODE_REGEX.test(postalCode)) {
    errors.postalCode = "A valid 6-digit Indian PIN code is required.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      fullName,
      phoneNumber,
      street,
      landmark,
      city,
      state,
      postalCode,
      country,
      isDefault,
    },
  };
}

/**
 * Validate Cart Item Add / Update
 */
export function validateCartItemInput(data: any): ValidationResult<{
  variantId: string;
  quantity: number;
}> {
  const errors: Record<string, string> = {};
  const variantId = sanitizeString(data?.variantId);
  const quantity = parseInt(data?.quantity, 10);

  if (!variantId) {
    errors.variantId = "Product variant ID is required.";
  }

  if (isNaN(quantity) || quantity < 1 || quantity > 50) {
    errors.quantity = "Quantity must be between 1 and 50 units.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: { variantId, quantity } };
}

/**
 * Validate Order Placement / Checkout
 */
export function validateCheckoutInput(data: any): ValidationResult<{
  items: Array<{ variantId: string; quantity: number }>;
  shippingAddress: {
    fullName: string;
    phoneNumber: string;
    street: string;
    landmark?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  billingAddress?: {
    fullName: string;
    phoneNumber: string;
    street: string;
    landmark?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: "RAZORPAY" | "COD";
  customerNotes?: string;
  couponCode?: string;
  guestEmail?: string;
  guestPhone?: string;
  guestName?: string;
}> {
  const errors: Record<string, string> = {};

  if (!Array.isArray(data?.items) || data.items.length === 0) {
    errors.items = "Order must contain at least one product.";
  }

  const items: Array<{ variantId: string; quantity: number }> = [];
  if (Array.isArray(data?.items)) {
    for (let i = 0; i < data.items.length; i++) {
      const it = data.items[i];
      const vId = sanitizeString(it?.variantId);
      const qty = parseInt(it?.quantity, 10);
      if (!vId || isNaN(qty) || qty < 1) {
        errors[`items[${i}]`] = "Invalid variant or quantity in cart.";
      } else {
        items.push({ variantId: vId, quantity: qty });
      }
    }
  }

  const addrVal = validateAddressInput(data?.shippingAddress);
  if (!addrVal.success) {
    Object.entries(addrVal.errors || {}).forEach(([k, v]) => {
      errors[`shippingAddress.${k}`] = v;
    });
  }

  let billingAddressData = undefined;
  if (data?.billingAddress) {
    const billingVal = validateAddressInput(data.billingAddress);
    if (!billingVal.success) {
      Object.entries(billingVal.errors || {}).forEach(([k, v]) => {
        errors[`billingAddress.${k}`] = v;
      });
    } else {
      billingAddressData = billingVal.data;
    }
  }

  const paymentMethod = data?.paymentMethod === "COD" ? "COD" : "RAZORPAY";
  const customerNotes = data?.customerNotes ? sanitizeString(data.customerNotes) : undefined;
  const couponCode = data?.couponCode ? sanitizeString(data.couponCode).toUpperCase() : undefined;

  const guestEmail = data?.guestEmail ? sanitizeString(data.guestEmail).toLowerCase() : undefined;
  const guestPhone = data?.guestPhone ? sanitizeString(data.guestPhone) : undefined;
  const guestName = data?.guestName ? sanitizeString(data.guestName) : undefined;

  if (guestEmail && !EMAIL_REGEX.test(guestEmail)) {
    errors.guestEmail = "Invalid guest email format.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      items,
      shippingAddress: addrVal.data!,
      billingAddress: billingAddressData,
      paymentMethod,
      customerNotes,
      couponCode,
      guestEmail,
      guestPhone,
      guestName,
    },
  };
}

/**
 * Validate Product Review Submission
 */
export function validateReviewInput(data: any): ValidationResult<{
  productId: string;
  rating: number;
  title: string;
  comment: string;
  authorName: string;
  authorEmail: string;
}> {
  const errors: Record<string, string> = {};
  const productId = sanitizeString(data?.productId);
  const rating = parseInt(data?.rating, 10);
  const title = sanitizeString(data?.title);
  const comment = sanitizeString(data?.comment);
  const authorName = sanitizeString(data?.authorName);
  const authorEmail = sanitizeString(data?.authorEmail).toLowerCase();

  if (!productId) errors.productId = "Product ID is required.";
  if (isNaN(rating) || rating < 1 || rating > 5) errors.rating = "Rating must be between 1 and 5 stars.";
  if (!title || title.length < 3) errors.title = "Review headline must be at least 3 characters.";
  if (!comment || comment.length < 10) errors.comment = "Review comment must be at least 10 characters.";
  if (!authorName || authorName.length < 2) errors.authorName = "Your name is required.";
  if (!authorEmail || !EMAIL_REGEX.test(authorEmail)) errors.authorEmail = "Valid email is required.";

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: { productId, rating, title, comment, authorName, authorEmail },
  };
}

/**
 * Validate Coupon Creation & Update Payload
 */
export function validateCouponInput(data: any): ValidationResult<{
  code: string;
  description?: string;
  discountType: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
  discountValue: number;
  minOrderValue: number;
  maxDiscountValue?: number;
  startDate: Date;
  endDate: Date;
  usageLimit?: number;
  isActive: boolean;
}> {
  const errors: Record<string, string> = {};

  const code = sanitizeString(data?.code).toUpperCase().replace(/[^A-Z0-9_-]/g, "");
  const description = data?.description ? sanitizeString(data.description) : undefined;
  const rawType = data?.discountType;
  const discountType: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING" =
    rawType === "FIXED" || rawType === "FREE_SHIPPING" ? rawType : "PERCENTAGE";

  const discountValue = Number(data?.discountValue) || 0;
  const minOrderValue = Math.max(0, Number(data?.minOrderValue) || 0);
  const maxDiscountValue = data?.maxDiscountValue ? Math.max(0, Number(data.maxDiscountValue)) : undefined;

  const startDate = data?.startDate ? new Date(data.startDate) : new Date();
  const endDate = data?.endDate ? new Date(data.endDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  const usageLimit = data?.usageLimit ? Math.max(1, parseInt(data.usageLimit, 10)) : undefined;
  const isActive = data?.isActive !== undefined ? Boolean(data.isActive) : true;

  if (!code || code.length < 3 || code.length > 20) {
    errors.code = "Coupon code must be between 3 and 20 alphanumeric characters.";
  }

  if (discountType === "PERCENTAGE") {
    if (discountValue <= 0 || discountValue > 100) {
      errors.discountValue = "Percentage discount must be between 1% and 100%.";
    }
  } else if (discountType === "FIXED") {
    if (discountValue <= 0) {
      errors.discountValue = "Fixed discount amount must be greater than 0.";
    }
  }

  if (isNaN(startDate.getTime())) {
    errors.startDate = "Invalid start date.";
  }

  if (isNaN(endDate.getTime())) {
    errors.endDate = "Invalid expiry date.";
  } else if (endDate <= startDate) {
    errors.endDate = "Expiry date must be after the start date.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      code,
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscountValue,
      startDate,
      endDate,
      usageLimit,
      isActive,
    },
  };
}

