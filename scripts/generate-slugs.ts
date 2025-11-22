/**
 * Script to generate slugs for existing products
 * Run with: npx tsx scripts/generate-slugs.ts
 */
import { PrismaClient } from "@prisma/client";
import { generateSlug, generateUniqueSlug } from "../src/lib/slug";

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: {
      slug: null,
    },
  });

  console.log(`Found ${products.length} products without slugs`);

  const existingSlugs = (
    await prisma.product.findMany({
      where: { slug: { not: null } },
      select: { slug: true },
    })
  ).map((p) => p.slug!);

  for (const product of products) {
    const baseSlug = generateSlug(product.title);
    const slug = generateUniqueSlug(baseSlug, existingSlugs);

    await prisma.product.update({
      where: { id: product.id },
      data: { slug },
    });

    existingSlugs.push(slug);
    console.log(`✓ Generated slug "${slug}" for "${product.title}"`);
  }

  console.log("\nDone!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
