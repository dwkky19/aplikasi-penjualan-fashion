import { db } from "./index.js";
import {
  categories,
  suppliers,
  products,
  productVariants,
  productImages,
} from "./schema.js";
import "dotenv/config";

/**
 * Seed script to populate the database with sample fashion data.
 * Run: npm run db:seed
 */
async function seed() {
  console.log("🌱 Seeding database...\n");

  // --- Categories ---
  console.log("  📂 Creating categories...");
  const [couture, readyToWear, accessories] = await db
    .insert(categories)
    .values([
      {
        name: "Couture",
        slug: "couture",
        description: "Koleksi haute couture eksklusif dari atelier.",
      },
      {
        name: "Siap Pakai",
        slug: "siap-pakai",
        description: "Koleksi ready-to-wear untuk sehari-hari.",
      },
      {
        name: "Aksesoris",
        slug: "aksesoris",
        description: "Pelengkap gaya dari perhiasan hingga tas.",
      },
    ])
    .returning();

  // --- Suppliers ---
  console.log("  🏭 Creating suppliers...");
  const [atelierLyon, tokyoCraft, milanoSilks, swissTech] = await db
    .insert(suppliers)
    .values([
      {
        name: "Atelier Lyon",
        contactEmail: "order@atelierlyon.fr",
        contactPhone: "+33-1-2345-6789",
        address: "12 Rue de la Mode, Lyon, France",
      },
      {
        name: "Tokyo Craft",
        contactEmail: "supply@tokyocraft.jp",
        contactPhone: "+81-3-1234-5678",
        address: "Minato-ku, Tokyo, Japan",
      },
      {
        name: "Milano Silks",
        contactEmail: "info@milanosilks.it",
        contactPhone: "+39-02-1234-5678",
        address: "Via Montenapoleone 8, Milano, Italy",
      },
      {
        name: "Swiss Tech",
        contactEmail: "parts@swisstech.ch",
        contactPhone: "+41-44-123-4567",
        address: "Bahnhofstrasse 10, Zürich, Switzerland",
      },
    ])
    .returning();

  // --- Products ---
  console.log("  👗 Creating products...");
  const productData = [
    {
      name: "Architectural Silk Gown",
      slug: "architectural-silk-gown",
      description:
        "Gaun sutra arsitektural dengan potongan struktural futuristik.",
      basePrice: "12450000",
      costPrice: "5800000",
      categoryId: couture.id,
      supplierId: milanoSilks.id,
      collection: "Midnight Series '24",
      isFeatured: true,
      isNewSeason: true,
    },
    {
      name: "Midnight Tuxedo Blazer",
      slug: "midnight-tuxedo-blazer",
      description: "Blazer tuxedo dengan detail mewah untuk acara malam.",
      basePrice: "3200000",
      costPrice: "1400000",
      categoryId: readyToWear.id,
      supplierId: atelierLyon.id,
      collection: "Midnight Series '24",
      isFeatured: false,
      isNewSeason: false,
    },
    {
      name: "Eclipse Leather Blazer",
      slug: "eclipse-leather-blazer",
      description: "Jaket kulit premium dengan desain modern struktural.",
      basePrice: "4500000",
      costPrice: "2000000",
      categoryId: readyToWear.id,
      supplierId: atelierLyon.id,
      collection: "Midnight Series v2",
      isFeatured: false,
      isNewSeason: false,
    },
    {
      name: "Obsidian Shell Clutch",
      slug: "obsidian-shell-clutch",
      description: "Tas clutch kulit desainer berbentuk kerang.",
      basePrice: "1850000",
      costPrice: "700000",
      categoryId: accessories.id,
      supplierId: milanoSilks.id,
      collection: "Midnight Series '24",
      isFeatured: false,
      isNewSeason: false,
    },
    {
      name: "Cyber-Silk Bodice",
      slug: "cyber-silk-bodice",
      description:
        "Korset sutra cyber dengan aksen futuristik, couture eksklusif.",
      basePrice: "4100000",
      costPrice: "1800000",
      categoryId: couture.id,
      supplierId: milanoSilks.id,
      collection: "Midnight Series '24",
      isFeatured: false,
      isNewSeason: false,
    },
    {
      name: "Vector Heel - Noir",
      slug: "vector-heel-noir",
      description: "Sepatu hak tinggi desainer dengan garis geometris.",
      basePrice: "2400000",
      costPrice: "900000",
      categoryId: accessories.id,
      supplierId: tokyoCraft.id,
      collection: "Midnight Series '24",
      isFeatured: false,
      isNewSeason: false,
    },
    {
      name: "Lumina Wrap Coat",
      slug: "lumina-wrap-coat",
      description:
        "Mantel bungkus dengan serat wol Italia dan pola fiber-optik.",
      basePrice: "18000000",
      costPrice: "8500000",
      categoryId: couture.id,
      supplierId: atelierLyon.id,
      collection: "Koleksi Pameran",
      isFeatured: true,
      isNewSeason: true,
    },
    {
      name: "Neon Runner V3",
      slug: "neon-runner-v3",
      description: "Sneakers premium dengan desain minimalis futuristik.",
      basePrice: "2800000",
      costPrice: "1100000",
      categoryId: accessories.id,
      supplierId: tokyoCraft.id,
      collection: "Activewear Luxe",
      isFeatured: false,
      isNewSeason: false,
    },
    {
      name: "Silk Night Gown",
      slug: "silk-night-gown",
      description: "Gaun malam sutra dari koleksi couture eksklusif.",
      basePrice: "8500000",
      costPrice: "3800000",
      categoryId: couture.id,
      supplierId: milanoSilks.id,
      collection: "Koleksi Couture",
      isFeatured: false,
      isNewSeason: false,
    },
    {
      name: "Nocturne Watch",
      slug: "nocturne-watch",
      description: "Jam tangan desainer minimalis dengan presisi Swiss.",
      basePrice: "6800000",
      costPrice: "2800000",
      categoryId: accessories.id,
      supplierId: swissTech.id,
      collection: "Lini Aksesoris",
      isFeatured: false,
      isNewSeason: false,
    },
    {
      name: "Velvet Night Blazer",
      slug: "velvet-night-blazer",
      description: "Blazer beludru malam dengan detail elegan.",
      basePrice: "3500000",
      costPrice: "1500000",
      categoryId: readyToWear.id,
      supplierId: atelierLyon.id,
      collection: "Best Sellers",
      isFeatured: true,
      isNewSeason: false,
    },
    {
      name: "Electric Citron Gown",
      slug: "electric-citron-gown",
      description: "Gaun pesta warna citron yang memukau.",
      basePrice: "4200000",
      costPrice: "1900000",
      categoryId: couture.id,
      supplierId: milanoSilks.id,
      collection: "Best Sellers",
      isFeatured: true,
      isNewSeason: false,
    },
  ];

  const insertedProducts = await db
    .insert(products)
    .values(productData)
    .returning();

  // --- Product Variants ---
  console.log("  📦 Creating product variants...");
  const variantData = insertedProducts.flatMap((product, idx) => {
    const sizes = ["S", "M", "L", "XL"];
    const stockLevels = [
      [4, 8, 12, 6],
      [12, 15, 10, 8],
      [84, 70, 60, 45],
      [2, 3, 1, 0],
      [6, 8, 4, 2],
      [15, 20, 12, 8],
      [2, 3, 1, 1],
      [12, 8, 5, 3],
      [0, 0, 0, 0],
      [142, 120, 100, 80],
      [50, 42, 35, 28],
      [30, 25, 20, 15],
    ];

    return sizes.map((size, sizeIdx) => ({
      productId: product.id,
      sku: `AT-${String(idx * 100 + sizeIdx + 1).padStart(4, "0")}`,
      size,
      color: "Default",
      stock: stockLevels[idx]?.[sizeIdx] ?? 10,
      minStock: 5,
      maxStock: 100,
    }));
  });

  await db.insert(productVariants).values(variantData);

  // --- Product Images ---
  console.log("  🖼️  Creating product images...");
  const imageData = insertedProducts.map((product) => ({
    productId: product.id,
    url: `https://placehold.co/400x500/1b1a26/7c3aed?text=${encodeURIComponent(product.name)}`,
    altText: product.name,
    isPrimary: true,
    sortOrder: 0,
  }));

  await db.insert(productImages).values(imageData);

  console.log("\n✅ Seed completed successfully!");
  console.log(`   📂 ${3} categories`);
  console.log(`   🏭 ${4} suppliers`);
  console.log(`   👗 ${insertedProducts.length} products`);
  console.log(`   📦 ${variantData.length} variants`);
  console.log(`   🖼️  ${imageData.length} images`);

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
