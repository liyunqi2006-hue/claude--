-- Rename products.priceCNY to products.priceUSD (product prices are now denominated in USD)
ALTER TABLE "products" RENAME COLUMN "priceCNY" TO "priceUSD";

-- Orders now record both the USD price charged and the CNY amount actually collected via the pay channel
ALTER TABLE "orders" ADD COLUMN "amountUSD" DECIMAL(10,2);
UPDATE "orders" SET "amountUSD" = "amountCNY" WHERE "amountUSD" IS NULL;
ALTER TABLE "orders" ALTER COLUMN "amountUSD" SET NOT NULL;

-- Rename subscription plan max30x -> max20x
ALTER TYPE "SubscriptionPlan" RENAME VALUE 'max30x' TO 'max20x';
