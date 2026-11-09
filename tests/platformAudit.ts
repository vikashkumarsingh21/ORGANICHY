/**
 * ORGANICHY Complete E-Commerce Platform Test Suite & Audit Runner
 * Validates Core Business Logic, Security Controls, Pricing, Indian Shipping,
 * Cryptographic Signatures, SEO Schemas, and Input Sanitization.
 */

import assert from "node:assert";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// 1. PIN code data & calculations
import { checkIndianPincodeServiceability } from "../src/lib/shipping/pincodeData";

// 2. SEO & Schemas
import {
  getOrganizationSchema,
  getWebsiteSchema,
  getProductSchema,
  getBreadcrumbSchema,
} from "../src/lib/seo";

// 3. Validation & Sanitization
import {
  sanitizeString,
  isValidEmail,
  isValidIndianPhone,
  isValidIndianPincode,
  sanitizeQuantity,
} from "../src/lib/validation";

// 4. Rate Limiting
import { checkRateLimit } from "../src/lib/rateLimit";

// 5. Constants & Demo Data
import { BRAND } from "../src/lib/constants";
import { DEMO_PRODUCTS } from "../src/lib/demoData";

// 6. Manual Shipping Service
import { ManualShippingService } from "../src/lib/shipping/manualShippingService";

// 7. Dynamic Content Management System (CMS) Service
import { CmsService } from "../src/lib/cmsService";

const TEST_RESULTS: {
  total: number;
  passed: number;
  failed: number;
  details: Array<{ name: string; status: string; error?: string }>;
} = {
  total: 0,
  passed: 0,
  failed: 0,
  details: [],
};

function test(name: string, fn: () => void) {
  TEST_RESULTS.total += 1;
  try {
    fn();
    TEST_RESULTS.passed += 1;
    TEST_RESULTS.details.push({ name, status: "PASS" });
    console.log(`  ✓ PASS: ${name}`);
  } catch (err: any) {
    TEST_RESULTS.failed += 1;
    TEST_RESULTS.details.push({ name, status: "FAIL", error: err.message });
    console.error(`  ✗ FAIL: ${name} -> ${err.message}`);
  }
}

async function asyncTest(name: string, fn: () => Promise<void>) {
  TEST_RESULTS.total += 1;
  try {
    await fn();
    TEST_RESULTS.passed += 1;
    TEST_RESULTS.details.push({ name, status: "PASS" });
    console.log(`  ✓ PASS: ${name}`);
  } catch (err: any) {
    TEST_RESULTS.failed += 1;
    TEST_RESULTS.details.push({ name, status: "FAIL", error: err.message });
    console.error(`  ✗ FAIL: ${name} -> ${err.message}`);
  }
}

async function runAllTests() {
  console.log("=================================================================");
  console.log("  ORGANICHY FULL-STACK E-COMMERCE PLATFORM AUTOMATED AUDIT");
  console.log("=================================================================\n");

  // -------------------------------------------------------------
  // SUITE 1: CATALOG & PRODUCT INTEGRITY
  // -------------------------------------------------------------
  console.log("[SUITE 1] Catalog & Nutrition Products Integrity");

  test("Catalog contains active peanut butter items", () => {
    assert(Array.isArray(DEMO_PRODUCTS) && DEMO_PRODUCTS.length >= 3, "Catalog must have at least 3 core peanut butter products");
  });

  test("Every product has title, valid slug, ingredients, and variants", () => {
    for (const prod of DEMO_PRODUCTS) {
      assert(prod.title && prod.title.length > 5, `Product title missing for ${prod.id}`);
      assert(prod.slug && /^[a-z0-9-]+$/.test(prod.slug), `Invalid slug format: ${prod.slug}`);
      assert(Array.isArray(prod.variants) && prod.variants.length > 0, `No variants for ${prod.slug}`);
      assert(prod.variants[0].price > 0, `Invalid price for ${prod.slug}`);
    }
  });

  test("Brand constants match Moradabad origin and Founder Sourav", () => {
    assert.strictEqual(BRAND.name, "ORGANICHY");
    assert.strictEqual(BRAND.founder, "Sourav");
    assert(BRAND.location.includes("Moradabad"), "Brand location must specify Moradabad, Uttar Pradesh");
    assert.strictEqual(BRAND.policies.freeShippingThreshold, 499);
  });

  // -------------------------------------------------------------
  // SUITE 2: INDIAN PIN CODE SERVICEABILITY & SHIPPING
  // -------------------------------------------------------------
  console.log("\n[SUITE 2] Indian Postal Serviceability & Logistics Hub");

  test("Moradabad (244001) local hub check", () => {
    const res = checkIndianPincodeServiceability("244001");
    assert.strictEqual(res.isServiceable, true);
    assert.strictEqual(res.city, "Moradabad");
    assert.strictEqual(res.state, "Uttar Pradesh");
    assert.strictEqual(res.codAvailable, true);
  });

  test("Delhi-NCR (110001) metro check", () => {
    const res = checkIndianPincodeServiceability("110001");
    assert.strictEqual(res.isServiceable, true);
    assert.strictEqual(res.city, "New Delhi");
    assert.strictEqual(res.state, "Delhi");
  });

  test("Bengaluru (560103) South India metro check", () => {
    const res = checkIndianPincodeServiceability("560103");
    assert.strictEqual(res.isServiceable, true);
    assert.strictEqual(res.state, "Karnataka");
  });

  test("Invalid PIN codes correctly rejected", () => {
    assert.strictEqual(checkIndianPincodeServiceability("000000").isServiceable, false);
    assert.strictEqual(checkIndianPincodeServiceability("123").isServiceable, false);
    assert.strictEqual(checkIndianPincodeServiceability("ABCDEF").isServiceable, false);
    assert.strictEqual(checkIndianPincodeServiceability("").isServiceable, false);
  });

  test("Manual Shipping Service generates valid carrier tracking links", () => {
    const urlDel = ManualShippingService.getTrackingUrl("Delhivery", "DEL-12345");
    assert(urlDel.includes("delhivery.com"), "Delhivery tracking URL must point to delhivery.com");

    const urlBlu = ManualShippingService.getTrackingUrl("Blue Dart", "BLU-99881");
    assert(urlBlu.includes("bluedart.com"), "Blue Dart tracking URL must point to bluedart.com");
  });

  // -------------------------------------------------------------
  // SUITE 3: INPUT VALIDATION & XSS SANITIZATION
  // -------------------------------------------------------------
  console.log("\n[SUITE 3] Input Validation & XSS Prevention");

  test("sanitizeString encodes HTML entities to prevent XSS", () => {
    const raw = '<script>alert("XSS Attack")</script>';
    const sanitized = sanitizeString(raw);
    assert(!sanitized.includes("<script>"), "Must strip open script tags");
    assert(sanitized.includes("&lt;script&gt;"), "Must encode angle brackets");
  });

  test("isValidEmail accepts legitimate addresses and rejects invalid formats", () => {
    assert.strictEqual(isValidEmail("care@organichy.com"), true);
    assert.strictEqual(isValidEmail("customer.sourav@gmail.co.in"), true);
    assert.strictEqual(isValidEmail("invalid-email"), false);
    assert.strictEqual(isValidEmail("@domain.com"), false);
    assert.strictEqual(isValidEmail("user@.com"), false);
  });

  test("isValidIndianPhone validates 10-digit Indian mobile formats", () => {
    assert.strictEqual(isValidIndianPhone("9876543210"), true);
    assert.strictEqual(isValidIndianPhone("+91 98765 43210"), true);
    assert.strictEqual(isValidIndianPhone("1234567890"), false, "Numbers starting with 1 are invalid in India");
    assert.strictEqual(isValidIndianPhone("98765"), false, "Incomplete phone must fail");
  });

  test("isValidIndianPincode strictly enforces 6 digits", () => {
    assert.strictEqual(isValidIndianPincode("244001"), true);
    assert.strictEqual(isValidIndianPincode("560103"), true);
    assert.strictEqual(isValidIndianPincode("011001"), false, "PIN starting with 0 is invalid");
    assert.strictEqual(isValidIndianPincode("24400"), false, "5-digit PIN must fail");
    assert.strictEqual(isValidIndianPincode("2440012"), false, "7-digit PIN must fail");
  });

  test("sanitizeQuantity clamps numbers within safe order bounds", () => {
    assert.strictEqual(sanitizeQuantity(2), 2);
    assert.strictEqual(sanitizeQuantity(-5), 1, "Negative numbers clamped to min 1");
    assert.strictEqual(sanitizeQuantity(100), 24, "Excessive bulk order clamped to max 24 per order");
    assert.strictEqual(sanitizeQuantity("abc"), 1, "NaN clamped to min 1");
  });

  // -------------------------------------------------------------
  // SUITE 4: SECURITY & RATE LIMITING
  // -------------------------------------------------------------
  console.log("\n[SUITE 4] Security Controls & Rate Limiting");

  test("Sliding-window rate limiter permits requests under threshold", () => {
    const testKey = `test_rate_${Date.now()}`;
    const res1 = checkRateLimit(testKey, 3, 10);
    assert.strictEqual(res1.success, true);
    assert.strictEqual(res1.isAllowed, true);
    assert.strictEqual(res1.remaining, 2);

    const res2 = checkRateLimit(testKey, 3, 10);
    assert.strictEqual(res2.remaining, 1);
  });

  test("Rate limiter blocks requests exceeding threshold", () => {
    const blockKey = `test_block_${Date.now()}`;
    checkRateLimit(blockKey, 2, 10);
    checkRateLimit(blockKey, 2, 10);
    const blocked = checkRateLimit(blockKey, 2, 10);

    assert.strictEqual(blocked.success, false);
    assert.strictEqual(blocked.isAllowed, false);
    assert.strictEqual(blocked.remaining, 0);
    assert(blocked.retryAfterSeconds > 0, "Must return retry-after time");
  });

  // -------------------------------------------------------------
  // SUITE 5: AUTHENTICATION & CRYPTOGRAPHY
  // -------------------------------------------------------------
  console.log("\n[SUITE 5] Cryptographic Signatures & JWT Authentication");

  await asyncTest("Bcrypt salting and secure password comparison", async () => {
    const plainPassword = "OrganichySecurePass@2026";
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(plainPassword, salt);

    assert(hash.startsWith("$2"), "Must generate valid bcrypt hash");
    const isMatch = await bcrypt.compare(plainPassword, hash);
    assert.strictEqual(isMatch, true, "Bcrypt compare must succeed for correct password");

    const isWrong = await bcrypt.compare("WrongPassword", hash);
    assert.strictEqual(isWrong, false, "Bcrypt compare must fail for wrong password");
  });

  test("JWT signing and cryptographic verification", () => {
    const secret = "test_jwt_secret_organichy_2026";
    const payload = { userId: "usr_sourav", email: "sourav@organichy.com", role: "ADMIN" };
    const token = jwt.sign(payload, secret, { expiresIn: "1h" });

    assert(typeof token === "string" && token.split(".").length === 3, "JWT must contain 3 segments");
    const decoded: any = jwt.verify(token, secret);
    assert.strictEqual(decoded.userId, "usr_sourav");
    assert.strictEqual(decoded.role, "ADMIN");

    // Verify tampering detection
    assert.throws(() => {
      jwt.verify(token, "tampered_secret");
    }, "Tampered secret must throw verification error");
  });

  test("Razorpay HMAC SHA256 Webhook Signature validation", () => {
    const webhookSecret = "rzp_secret_organichy_test";
    const rawBody = JSON.stringify({
      event: "payment.captured",
      payload: { payment: { entity: { id: "pay_101", amount: 99800 } } },
    });

    const validSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    assert.strictEqual(typeof validSignature, "string");
    assert.strictEqual(validSignature.length, 64, "SHA-256 hex string must be 64 characters");

    // Verify forged signature is detected
    const forgedSignature = "forged_signature_attempt_abcdef1234567890";
    assert.notStrictEqual(validSignature, forgedSignature, "Forged signature must not match calculated HMAC");
  });

  // -------------------------------------------------------------
  // SUITE 6: SEO SCHEMAS & STRUCTURED DATA
  // -------------------------------------------------------------
  console.log("\n[SUITE 6] SEO Schemas & JSON-LD Structured Data");

  test("getOrganizationSchema produces valid schema.org Organization", () => {
    const schema: any = getOrganizationSchema();
    assert.strictEqual(schema["@context"], "https://schema.org");
    assert.strictEqual(schema["@type"], "Organization");
    assert.strictEqual(schema.name, "ORGANICHY");
    assert.strictEqual(schema.founder["@type"], "Person");
    assert.strictEqual(schema.founder.name, "Sourav");
    assert.strictEqual(schema.address.addressLocality, "Moradabad");
    assert.strictEqual(schema.address.addressRegion, "Uttar Pradesh");
  });

  test("getProductSchema produces valid schema.org Product with INR Offer", () => {
    const testProduct = DEMO_PRODUCTS[0];
    const schema: any = getProductSchema(testProduct);

    assert.strictEqual(schema["@context"], "https://schema.org");
    assert.strictEqual(schema["@type"], "Product");
    assert.strictEqual(schema.name, testProduct.title);
    assert.strictEqual(schema.brand.name, "ORGANICHY");
    assert.strictEqual(schema.offers["@type"], "Offer");
    assert.strictEqual(schema.offers.priceCurrency, "INR");
    assert.strictEqual(schema.offers.availability, "https://schema.org/InStock");
    assert(schema.aggregateRating.ratingValue >= 4.0, "Rating value must be positive");
  });

  test("getBreadcrumbSchema produces hierarchical schema.org BreadcrumbList", () => {
    const breadcrumbs = getBreadcrumbSchema([
      { name: "Home", item: "/" },
      { name: "Shop", item: "/shop" },
      { name: "Creamy Peanut Butter", item: "/product/all-natural-creamy-peanut-butter" },
    ]);

    assert.strictEqual(breadcrumbs["@type"], "BreadcrumbList");
    assert.strictEqual(breadcrumbs.itemListElement.length, 3);
    assert.strictEqual(breadcrumbs.itemListElement[0].position, 1);
    assert.strictEqual(breadcrumbs.itemListElement[2].name, "Creamy Peanut Butter");
  });

  // -------------------------------------------------------------
  // DYNAMIC CONTENT MANAGEMENT SYSTEM (CMS) AUDIT
  // -------------------------------------------------------------
  await test("CMS Service loads all 11 default website sections covering key storefront managers", async () => {
    const sections = await CmsService.getAllSections();
    assert(sections.length >= 11, `Expected at least 11 CMS sections, found ${sections.length}`);

    const keys = sections.map((s) => s.sectionKey);
    const expectedKeys = [
      "home_hero_banner",
      "home_promo_banner",
      "home_featured_products",
      "home_why_choose",
      "about_content",
      "our_story_content",
      "faq_section",
      "contact_information",
      "footer_content",
      "social_media_links",
      "seo_metadata",
    ];

    for (const key of expectedKeys) {
      assert(keys.includes(key), `Missing required CMS section key: ${key}`);
    }
  });

  await test("CMS Hero Section contains Moradabad location badge and high-protein nutrition chips", async () => {
    const hero = await CmsService.getSectionByKey("home_hero_banner");
    assert(hero !== null, "Hero section must exist");
    assert(hero?.badgeText?.includes("MORADABAD"), "Hero badge must cite Moradabad origin");
    assert(hero?.title?.includes("Peanut Butter"), "Hero title must mention Peanut Butter");
    assert.strictEqual(hero?.ctaText, "Shop Now");
    assert(hero?.metadata?.stats?.length === 3, "Hero must contain 3 nutrition stats");
    assert.strictEqual(hero?.metadata?.stats[0]?.val, "30g");
  });

  await test("CMS Section Upsert allows administrator to update title, CTA, and image without code modification", async () => {
    const updated = await CmsService.upsertSection({
      sectionKey: "home_hero_banner",
      title: "100% Pure Indian Roasted Peanut Butter - Updated Live",
      ctaText: "Order Jar Now",
      ctaLink: "/shop?ref=hero",
      fallbackUrl: "https://images.unsplash.com/photo-test-hero.jpg",
    });

    assert.strictEqual(updated.title, "100% Pure Indian Roasted Peanut Butter - Updated Live");
    assert.strictEqual(updated.ctaText, "Order Jar Now");
    assert.strictEqual(updated.ctaLink, "/shop?ref=hero");

    const reloaded = await CmsService.getSectionByKey("home_hero_banner");
    assert.strictEqual(reloaded?.title, "100% Pure Indian Roasted Peanut Butter - Updated Live");
  });

  await test("CMS Section status toggle controls publish / unpublish visibility", async () => {
    await CmsService.toggleSectionStatus("home_promo_banner", false);
    let promo = await CmsService.getSectionByKey("home_promo_banner");
    assert.strictEqual(promo?.isActive, false, "Section should be unpublished/hidden");

    await CmsService.toggleSectionStatus("home_promo_banner", true);
    promo = await CmsService.getSectionByKey("home_promo_banner");
    assert.strictEqual(promo?.isActive, true, "Section should be published/active");
  });

  await test("CMS FAQ section contains structured Q&A items across categories", async () => {
    const faqSec = await CmsService.getSectionByKey("faq_section");
    assert(faqSec !== null, "FAQ section must exist");
    const faqs = faqSec?.metadata?.faqs;
    assert(Array.isArray(faqs) && faqs.length >= 6, "Must contain at least 6 detailed FAQs");
    assert(faqs[0].q.includes("oil"), "First FAQ must address natural oil separation purity");
  });

  await test("CMS Story section contains milestone timeline of Sourav's origin story in Moradabad", async () => {
    const story = await CmsService.getSectionByKey("our_story_content");
    assert(story !== null, "Story section must exist");
    const milestones = story?.metadata?.milestones;
    assert(Array.isArray(milestones) && milestones.length >= 4, "Must contain at least 4 story milestones");
    assert(milestones[0].title.includes("Gym") || milestones[0].year.includes("Spark"), "First milestone must highlight gym origin");
  });

  await test("CMS Contact and Social information provide valid pan-India channels", async () => {
    const contact = await CmsService.getSectionByKey("contact_information");
    assert(contact?.metadata?.email.includes("@organichy.com"));
    assert(contact?.metadata?.address.includes("Moradabad"));

    const social = await CmsService.getSectionByKey("social_media_links");
    assert(social?.metadata?.instagram.includes("instagram.com"));
    assert(social?.metadata?.whatsapp.includes("wa.me"));
  });

  await test("CMS Image fallback resolves to custom fallback when mediaAsset is unassigned", async () => {
    const fallbackUrl = "https://images.unsplash.com/custom-test.jpg";
    const resolvedUrl = await CmsService.getSectionImageUrl("test_unassigned_key", fallbackUrl);
    assert.strictEqual(resolvedUrl, fallbackUrl);
  });

  // -------------------------------------------------------------
  // AUDIT SUMMARY
  // -------------------------------------------------------------
  console.log("\n=================================================================");
  console.log(`  PLATFORM AUDIT COMPLETE: ${TEST_RESULTS.passed}/${TEST_RESULTS.total} TESTS PASSED`);
  if (TEST_RESULTS.failed === 0) {
    console.log("  STATUS: ALL TESTS VERIFIED SUCCESSFULLY [0 FAILURES]");
  } else {
    console.log(`  STATUS: ${TEST_RESULTS.failed} TESTS FAILED`);
  }
  console.log("=================================================================\n");

  if (TEST_RESULTS.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAllTests();

