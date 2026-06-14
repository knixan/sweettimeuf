/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "category" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "printTemplates" JSONB,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "variantLabel" TEXT,
ADD COLUMN     "variantOptions" JSONB,
ADD COLUMN     "variants" TEXT[],
ALTER COLUMN "aboutProduct" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "userId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerLastName" TEXT,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "customerCompany" TEXT,
    "orgNumber" TEXT,
    "customerAddress" TEXT NOT NULL,
    "customerPostalCode" TEXT NOT NULL,
    "customerCity" TEXT NOT NULL,
    "invoiceAddress" TEXT,
    "invoicePostalCode" TEXT,
    "invoiceCity" TEXT,
    "items" JSONB NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "handled" BOOLEAN NOT NULL DEFAULT false,
    "shipped" BOOLEAN NOT NULL DEFAULT false,
    "invoiceSent" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "order_orderNumber_key" ON "order"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "category_slug_key" ON "category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "product_slug_key" ON "product"("slug");
