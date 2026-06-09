import { prisma } from "@/lib/prisma";
import { MetadataRoute } from "next";

const BASE_URL = "https://www.sweettime-uf.se";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [produkter, kategorier] = await Promise.all([
    prisma.product.findMany({
      select: { slug: true, updatedAt: true },
      where: { slug: { not: null } },
    }),
    prisma.category.findMany({
      select: { slug: true, updatedAt: true },
      where: { slug: { not: null } },
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/om-oss`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/produkt`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const produktRoutes: MetadataRoute.Sitemap = produkter.map((p) => ({
    url: `${BASE_URL}/produkt/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const kategoriRoutes: MetadataRoute.Sitemap = kategorier.map((k) => ({
    url: `${BASE_URL}/kategori/${k.slug}`,
    lastModified: k.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...produktRoutes, ...kategoriRoutes];
}
