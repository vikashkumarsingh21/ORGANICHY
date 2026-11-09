# 🔐 ORGANICHY E-Commerce Platform — Default Credentials & System Overview

> **Official Credentials and Pre-configured Accounts Document**  
> **Brand:** ORGANICHY (100% Pure Indian Nutrition, Moradabad, Uttar Pradesh)  
> **Founder:** Sourav  
> **Generated on:** November 8, 2026  

---

## 📋 Table of Contents
1. [Administrator Account (Founder & Management)](#1-administrator-account-founder--management)
2. [Verified Customer Account (Athlete Demo)](#2-verified-customer-account-athlete-demo)
3. [Guest Checkout Access](#3-guest-checkout-access)
4. [Active Promotional Coupons](#4-active-promotional-coupons)
5. [Pre-Seeded Products & Inventory Catalog](#5-pre-seeded-products--inventory-catalog)
6. [Dynamic CMS Pre-Seeded Sections](#6-dynamic-cms-pre-seeded-sections)
7. [API & Security Secrets (.env)](#7-api--security-secrets-env)
8. [Quick Verification Links](#8-quick-verification-links)

---

## 1. Administrator Account (Founder & Management)

This account grants complete unrestricted access to the **ORGANICHY Admin Console** and all administrative APIs.

| Field | Value |
|---|---|
| **Role** | `ADMIN` (Full System Administrator) |
| **Name** | `Sourav (Founder)` |
| **Email ID** | `admin@organichy.com` |
| **Password** | `OrganichyAdmin@2026` |
| **Alternate Password** | `OrganichySecureAdmin2026!` *(Configured in .env)* |
| **Phone Number** | `+91 98765 43210` |
| **Login URL** | [http://localhost:3000/admin/login](http://localhost:3000/admin/login) |
| **Admin Portal** | [http://localhost:3000/admin](http://localhost:3000/admin) |
| **Quick Action** | Click the **"Fill Founder Credentials (Sourav)"** button on `/admin/login` to auto-fill. |

### 🛠️ Accessible Administrative Modules:
1. **Overview Dashboard** (`/admin`) — Revenue metrics, order numbers, low stock alerts, revenue charts.
2. **Products Management** (`/admin/products`) — Create, edit, delete, unpublish, and adjust prices/variants.
3. **Categories Management** (`/admin/categories`) — Manage nutrition categories (Peanut Butter, Oats, Whey, Bars).
4. **Inventory & Stock** (`/admin/inventory`) — Batch tracking (`BATCH-ORG-2026-11A`), low-stock indicators, quantity adjustment history.
5. **Orders Management** (`/admin/orders`) — Status updates (Pending → Delivered), cancellation, printable tax invoices.
6. **Customer Directory** (`/admin/customers`) — Customer lists, total spend, address books, order count.
7. **Payment Management** (`/admin/payments`) — Razorpay payment IDs, signatures, refund processing, COD controls.
8. **Shipping & Logistics** (`/admin/shipping`) — Pan-India pincode lookup, Delhivery/Speed Post tracking setup, free shipping rules.
9. **Discount Coupons** (`/admin/coupons`) — Create/toggle percentage, flat rate, and free shipping coupons.
10. **Customer Reviews** (`/admin/reviews`) — Approve, reject, or feature 5-star athlete testimonials.
11. **Analytics & Performance** (`/admin/analytics`) — Best-selling jars, customer retention, growth stats.
12. **Media Library** (`/admin/media`) — Direct asset upload, folder organization, image replacements.
13. **Dynamic CMS Console** (`/admin/cms`) — 11-manager content control without touching code.
14. **FAQs Editor** (`/admin/faqs`) — Add, update, and reorder Q&A items.
15. **Notifications** (`/admin/notifications`) — System alerts, order notifications, low-stock warnings.
16. **Store Settings** (`/admin/settings`) — Delivery thresholds, contact channels, store address.

---

## 2. Verified Customer Account (Athlete Demo)

This account represents a registered Indian athlete/customer to test customer features.

| Field | Value |
|---|---|
| **Role** | `CUSTOMER` (Normal Storefront Buyer) |
| **Name** | `Vikram Athlete` |
| **Email ID** | `vikram.athlete@gmail.com` |
| **Password** | `Password@123` |
| **Phone Number** | `+91 98765 12345` |
| **Login URL** | [http://localhost:3000/login](http://localhost:3000/login) |
| **Customer Dashboard** | [http://localhost:3000/account](http://localhost:3000/account) |
| **Quick Action** | Click the **"Fill Customer Demo"** button on `/login` to auto-fill. |

### 👤 Accessible Customer Features:
- **Profile Management** — Edit full name, email, phone number.
- **My Orders** — Complete purchase history, downloadable invoices, item receipts.
- **Address Book** — Save multiple delivery addresses (Home, Gym, Work) with pincode validation.
- **Live Order Tracking** — Real-time tracking from Moradabad dispatch to doorstep.
- **Security & Password** — Update account password with current password verification.
- **Customer Isolation** — Customer accounts are strictly blocked from accessing `/admin` or administrative endpoints.

---

## 3. Guest Checkout Access

- **No account or password required.**
- URL: [http://localhost:3000/checkout](http://localhost:3000/checkout)
- Any customer can purchase by entering Name, Email, Phone, Address, and 6-digit Indian PIN code.
- Order confirmation is delivered via screen, email trigger, and order tracking link.

---

## 4. Active Promotional Coupons

These discount coupons are active and validated directly on the backend:

| Coupon Code | Discount Type | Value | Min Order Value | Description |
|---|---|---|---|---|
| **`ORGANICHY10`** | Percentage | **10% OFF** | ₹299 (Max ₹200) | Welcome discount on all Crunchy, Creamy & Chocolate jars. |
| **`SOURAV100`** | Flat Amount | **₹100 OFF** | ₹499 | Founder special discount on fresh batches. |
| **`FITNESS20`** | Percentage | **20% OFF** | ₹999 (Max ₹350) | High-volume gym athlete discount on 1kg value jars. |

---

## 5. Pre-Seeded Products & Inventory Catalog

All products are slow-roasted in Moradabad, Uttar Pradesh with 0% palm oil:

### Product 1: 100% All-Natural Crunchy Peanut Butter
- **Slug**: `/product/classic-crunchy-peanut-butter`
- **SKU (1kg)**: `ORG-PB-CRU-1000` — Price: ₹499 *(Compare: ₹649)* | Stock: 150
- **SKU (500g)**: `ORG-PB-CRU-500` — Price: ₹289 *(Compare: ₹375)* | Stock: 200
- **Protein**: 30.2g per 100g | Ingredients: 100% Slow-Roasted Indian Peanuts

### Product 2: 100% All-Natural Creamy Peanut Butter
- **Slug**: `/product/classic-creamy-peanut-butter`
- **SKU (1kg)**: `ORG-PB-CRM-1000` — Price: ₹499 *(Compare: ₹649)* | Stock: 120
- **SKU (500g)**: `ORG-PB-CRM-500` — Price: ₹289 *(Compare: ₹375)* | Stock: 180
- **Protein**: 30.0g per 100g | Ingredients: 100% Golden Roasted Peanuts

### Product 3: Dark Chocolate High-Protein Peanut Butter
- **Slug**: `/product/dark-chocolate-peanut-butter`
- **SKU (1kg)**: `ORG-PB-CHO-1000` — Price: ₹549 *(Compare: ₹699)* | Stock: 100
- **SKU (500g)**: `ORG-PB-CHO-500` — Price: ₹329 *(Compare: ₹420)* | Stock: 140
- **Protein**: 26.4g per 100g | Sweetened with Organic Jaggery (Zero White Sugar)

---

## 6. Dynamic CMS Pre-Seeded Sections

The website content is 100% dynamic and editable from `/admin/cms`:

| Section Key | Page | Managed Content |
|---|---|---|
| `home_hero_banner` | Home | Hero Heading, Subtitle, 3 Stat Chips, Review Quote, Hero Image. |
| `home_promo_banner` | Home | Special athlete discount banner, coupon code, banner toggle. |
| `home_featured_products` | Home | Product lineup selectors and upcoming category formulation tags. |
| `home_why_choose` | Home | Core brand advantages (0% palm oil, Moradabad roasted, etc.). |
| `about_content` | About Us | Founder narrative, mission statement, Moradabad facility standards. |
| `our_story_content` | Our Story | Founder's quote card, milestone timeline from home roaster to nationwide. |
| `faq_section` | FAQs | Structured Q&A cards with category classification. |
| `contact_information` | Contact | Support email, phone, Moradabad facility address, WhatsApp link. |
| `footer_content` | Global | Tagline, mission statement, copyright, regulatory disclaimers. |
| `social_media_links` | Global | Instagram, Facebook, YouTube, WhatsApp helpline links. |
| `seo_metadata` | Global | Meta title, description, keywords, OpenGraph image URL. |

---

## 7. API & Security Secrets (.env)

The environment configuration file (`.env`) contains the following local keys:

```env
# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# PostgreSQL Database (Local)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/organichy?schema=public"

# Cryptographic Keys
JWT_SECRET="organichy_super_secret_jwt_key_2026_dev_seed"
NEXTAUTH_SECRET="organichy_nextauth_secret_session_key_nutrition"

# Default Admin Seed Credentials
ADMIN_NAME="Sourav"
ADMIN_EMAIL="admin@organichy.com"
ADMIN_PASSWORD="OrganichySecureAdmin2026!"

# Razorpay Test Gateway Keys
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_placeholder"
RAZORPAY_KEY_ID="rzp_test_placeholder"
RAZORPAY_KEY_SECRET="placeholder_secret"
RAZORPAY_WEBHOOK_SECRET="organichy_webhook_secret_key_2026"

# Public Brand Details
NEXT_PUBLIC_STORE_NAME="ORGANICHY"
NEXT_PUBLIC_WHATSAPP_NUMBER="919876543210"
NEXT_PUBLIC_SUPPORT_EMAIL="care@organichy.com"
```

---

## 8. Quick Verification Links

- **Storefront Home**: [http://localhost:3000](http://localhost:3000)
- **Shop Catalog**: [http://localhost:3000/shop](http://localhost:3000/shop)
- **Our Story**: [http://localhost:3000/our-story](http://localhost:3000/our-story)
- **About Us**: [http://localhost:3000/about](http://localhost:3000/about)
- **Contact Us**: [http://localhost:3000/contact](http://localhost:3000/contact)
- **Customer Login**: [http://localhost:3000/login](http://localhost:3000/login)
- **Customer Register**: [http://localhost:3000/register](http://localhost:3000/register)
- **Customer Account**: [http://localhost:3000/account](http://localhost:3000/account)
- **Admin Login**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Admin Console**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Admin CMS**: [http://localhost:3000/admin/cms](http://localhost:3000/admin/cms)

