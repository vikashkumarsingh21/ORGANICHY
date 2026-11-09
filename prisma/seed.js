// Prisma Seed Script for ORGANICHY
// Moradabad, Uttar Pradesh, India - Founder: Sourav
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting ORGANICHY Database Seeding...");

  // 1. Seed Founder / Admin User
  const adminPasswordHash = await bcrypt.hash("OrganichyAdmin@2026", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@organichy.com" },
    update: {
      role: "ADMIN",
      passwordHash: adminPasswordHash,
      phone: "+91 98765 43210",
      name: "Sourav (Founder)",
    },
    create: {
      name: "Sourav (Founder)",
      email: "admin@organichy.com",
      passwordHash: adminPasswordHash,
      phone: "+91 98765 43210",
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin user seeded: ${adminUser.email}`);

  // 2. Seed Default Website Settings
  const settings = await prisma.websiteSettings.upsert({
    where: { id: "default_settings" },
    update: {
      storeName: "ORGANICHY",
      tagline: "Pure Nutrition for Active Lifestyles",
      founderName: "Sourav",
      founderLocation: "Moradabad, Uttar Pradesh, India",
      supportEmail: "care@organichy.com",
      supportPhone: "+91 98765 43210",
      whatsappNumber: "+91 98765 43210",
      freeShippingThreshold: 499,
      standardShippingFee: 49,
      codFee: 40,
      isCodEnabled: true,
      announcementText: "🌱 FREE All-India Shipping on orders above ₹499 | 100% Pure & Freshly Roasted in Moradabad",
    },
    create: {
      id: "default_settings",
      storeName: "ORGANICHY",
      tagline: "Pure Nutrition for Active Lifestyles",
      founderName: "Sourav",
      founderLocation: "Moradabad, Uttar Pradesh, India",
      supportEmail: "care@organichy.com",
      supportPhone: "+91 98765 43210",
      whatsappNumber: "+91 98765 43210",
      freeShippingThreshold: 499,
      standardShippingFee: 49,
      codFee: 40,
      isCodEnabled: true,
      announcementText: "🌱 FREE All-India Shipping on orders above ₹499 | 100% Pure & Freshly Roasted in Moradabad",
    },
  });
  console.log(`✅ Website settings configured for ${settings.storeName}`);

  // 3. Seed Product Categories
  const categoriesData = [
    {
      id: "cat-pb",
      name: "Peanut Butter",
      slug: "peanut-butter",
      description: "100% slow-roasted Indian peanuts stone-ground for maximum nutrition and authentic texture.",
      imageUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=800&auto=format&fit=crop",
      displayOrder: 1,
    },
    {
      id: "cat-oats",
      name: "High-Protein Oats",
      slug: "oats",
      description: "Clean whole-grain rolled oats enriched with plant proteins and dietary fiber.",
      imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop",
      displayOrder: 2,
    },
    {
      id: "cat-whey",
      name: "Clean Whey Protein",
      slug: "whey-protein",
      description: "Ultra-filtered grass-fed whey protein with zero artificial fillers and zero amino spiking.",
      imageUrl: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?q=80&w=800&auto=format&fit=crop",
      displayOrder: 3,
    },
    {
      id: "cat-bars",
      name: "Protein Bars",
      slug: "protein-bars",
      description: "Convenient on-the-go athletic fuel made with dates, nuts and clean whey.",
      imageUrl: "https://images.unsplash.com/photo-1622484216801-447a118e6988?q=80&w=800&auto=format&fit=crop",
      displayOrder: 4,
    },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log(`✅ Seeded ${categoriesData.length} product categories.`);

  // 4. Seed Primary Peanut Butter Products & Variants
  const products = [
    {
      id: "prod-pb-crunchy-01",
      title: "100% All-Natural Crunchy Peanut Butter",
      slug: "classic-crunchy-peanut-butter",
      shortDescription: "Slow-roasted Indian farm peanuts with crunchy chunks. 30g pure plant protein.",
      description: "Crafted in Moradabad using slow golden roasting. Our Crunchy Peanut Butter is packed with coarsely crushed roasted peanut chunks to deliver an authentic, rich crunch in every spoon. Made with 100% roasted peanuts — zero palm oil, zero preservatives, and zero added sugar. The premier choice for gym athletes and protein smoothies.",
      benefits: [
        "30g Plant-Based Protein per 100g",
        "Zero Added Palm Oil & Zero Hydrogenated Fats",
        "Zero Refined Sugars — Pure Natural Flavor",
        "Rich in Dietary Fiber, Magnesium & Healthy Monounsaturated Fats",
        "Handcrafted in Small Batches in Moradabad, UP",
      ],
      ingredients: "100% Slow-Roasted Indian Farm Peanuts. Nothing Else.",
      nutritionFacts: {
        Energy: "624 kcal",
        Protein: "30.2 g",
        Carbohydrates: "18.5 g",
        Fiber: "8.2 g",
        Fats: "48.6 g",
      },
      categoryId: "cat-pb",
      isFeatured: true,
      isBestSeller: true,
      variants: [
        {
          id: "var-pb-c-1kg",
          name: "1kg Classic Crunchy",
          weight: "1kg",
          flavor: "Crunchy",
          sku: "ORG-PB-CRU-1000",
          price: 499,
          compareAtPrice: 649,
          stock: 150,
          isDefault: true,
        },
        {
          id: "var-pb-c-500g",
          name: "500g Classic Crunchy",
          weight: "500g",
          flavor: "Crunchy",
          sku: "ORG-PB-CRU-500",
          price: 289,
          compareAtPrice: 375,
          stock: 200,
          isDefault: false,
        },
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=800&auto=format&fit=crop",
          altText: "ORGANICHY Classic Crunchy Peanut Butter Jar",
          displayOrder: 1,
          isThumbnail: true,
        },
        {
          url: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=800&auto=format&fit=crop",
          altText: "Roasted Peanut Butter Texture & Crunch",
          displayOrder: 2,
          isThumbnail: false,
        },
      ],
    },
    {
      id: "prod-pb-creamy-02",
      title: "100% All-Natural Creamy Peanut Butter",
      slug: "classic-creamy-peanut-butter",
      shortDescription: "Velvety smooth stone-ground peanut butter with 30g pure plant protein.",
      description: "Stone-ground to silk perfection. Our Creamy Peanut Butter melts smoothly onto warm toast, oatmeal, and fruit bowls. Crafted from single-origin Indian peanuts roasted slowly to bring out their natural nut sweetness without a single grain of added sugar.",
      benefits: [
        "Velvety Smooth Texture — Easy to Spread & Blend",
        "30g Pure Natural Protein",
        "Zero Hydrogenated Oil & Zero Trans Fats",
        "Keto, Vegan & Diabetic Friendly",
      ],
      ingredients: "100% Golden Slow-Roasted Peanuts.",
      nutritionFacts: {
        Energy: "625 kcal",
        Protein: "30.0 g",
        Carbohydrates: "18.8 g",
        Fiber: "8.0 g",
        Fats: "48.2 g",
      },
      categoryId: "cat-pb",
      isFeatured: true,
      isBestSeller: true,
      variants: [
        {
          id: "var-pb-crm-1kg",
          name: "1kg Classic Creamy",
          weight: "1kg",
          flavor: "Creamy",
          sku: "ORG-PB-CRM-1000",
          price: 499,
          compareAtPrice: 649,
          stock: 120,
          isDefault: true,
        },
        {
          id: "var-pb-crm-500g",
          name: "500g Classic Creamy",
          weight: "500g",
          flavor: "Creamy",
          sku: "ORG-PB-CRM-500",
          price: 289,
          compareAtPrice: 375,
          stock: 180,
          isDefault: false,
        },
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?q=80&w=800&auto=format&fit=crop",
          altText: "ORGANICHY Creamy Peanut Butter Spread",
          displayOrder: 1,
          isThumbnail: true,
        },
      ],
    },
    {
      id: "prod-pb-choco-03",
      title: "Dark Chocolate High-Protein Peanut Butter",
      slug: "dark-chocolate-peanut-butter",
      shortDescription: "Premium roasted peanuts blended with raw cocoa and natural jaggery.",
      description: "The ultimate guilt-free fitness indulgence. We blend our signature golden roasted peanuts with pure roasted cocoa and a hint of raw organic jaggery. Perfect for satisfying sweet cravings while hitting your daily bodybuilding macros.",
      benefits: [
        "Rich in Natural Antioxidants from Raw Cocoa",
        "26g High Quality Protein per 100g",
        "Sweetened only with Raw Organic Jaggery (Zero White Sugar)",
        "Kids & Fitness Lovers Favorite",
      ],
      ingredients: "Slow-Roasted Peanuts, Raw Cocoa Solids, Organic Jaggery, Natural Vanilla Extract.",
      nutritionFacts: {
        Energy: "588 kcal",
        Protein: "26.4 g",
        Carbohydrates: "24.2 g",
        Fiber: "7.8 g",
        Fats: "44.0 g",
      },
      categoryId: "cat-pb",
      isFeatured: true,
      isBestSeller: false,
      variants: [
        {
          id: "var-pb-ch-1kg",
          name: "1kg Dark Chocolate",
          weight: "1kg",
          flavor: "Dark Chocolate",
          sku: "ORG-PB-CHO-1000",
          price: 549,
          compareAtPrice: 699,
          stock: 100,
          isDefault: true,
        },
        {
          id: "var-pb-ch-500g",
          name: "500g Dark Chocolate",
          weight: "500g",
          flavor: "Dark Chocolate",
          sku: "ORG-PB-CHO-500",
          price: 329,
          compareAtPrice: 420,
          stock: 140,
          isDefault: false,
        },
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?q=80&w=800&auto=format&fit=crop",
          altText: "ORGANICHY Dark Chocolate Peanut Butter",
          displayOrder: 1,
          isThumbnail: true,
        },
      ],
    },
  ];

  for (const prod of products) {
    const { variants, images, ...prodData } = prod;

    const upsertedProduct = await prisma.product.upsert({
      where: { slug: prodData.slug },
      update: prodData,
      create: prodData,
    });

    // Variants and Inventories
    for (const v of variants) {
      const upsertedVariant = await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {
          productId: upsertedProduct.id,
          name: v.name,
          weight: v.weight,
          flavor: v.flavor,
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          stock: v.stock,
          isDefault: v.isDefault,
        },
        create: {
          id: v.id,
          productId: upsertedProduct.id,
          name: v.name,
          weight: v.weight,
          flavor: v.flavor,
          sku: v.sku,
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          stock: v.stock,
          isDefault: v.isDefault,
        },
      });

      // Dedicated Inventory Model
      await prisma.inventory.upsert({
        where: { variantId: upsertedVariant.id },
        update: {
          stockQuantity: v.stock,
          batchNumber: `BATCH-ORG-2026-11A`,
          warehouseLocation: "Moradabad Central Facility, UP",
        },
        create: {
          variantId: upsertedVariant.id,
          stockQuantity: v.stock,
          reservedQuantity: 0,
          lowStockThreshold: 15,
          batchNumber: `BATCH-ORG-2026-11A`,
          warehouseLocation: "Moradabad Central Facility, UP",
        },
      });
    }

    // Images
    for (const img of images) {
      await prisma.productImage.create({
        data: {
          productId: upsertedProduct.id,
          url: img.url,
          altText: img.altText,
          displayOrder: img.displayOrder,
          isThumbnail: img.isThumbnail,
        },
      });
    }
  }
  console.log(`✅ Seeded ${products.length} products with variants and inventories.`);

  // 5. Seed Promotional Coupons
  const coupons = [
    {
      code: "ORGANICHY10",
      description: "Welcome Discount: 10% off for all health lovers",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderValue: 299,
      maxDiscountValue: 200,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2027-12-31"),
      isActive: true,
    },
    {
      code: "SOURAV100",
      description: "Founder Special: Flat ₹100 OFF on orders above ₹499",
      discountType: "FIXED",
      discountValue: 100,
      minOrderValue: 499,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2027-12-31"),
      isActive: true,
    },
    {
      code: "FITNESS20",
      description: "Gym Enthusiasts: 20% off on 1kg Jars",
      discountType: "PERCENTAGE",
      discountValue: 20,
      minOrderValue: 999,
      maxDiscountValue: 350,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2027-12-31"),
      isActive: true,
    },
  ];

  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });
  }
  console.log(`✅ Seeded ${coupons.length} promotional coupons.`);

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

