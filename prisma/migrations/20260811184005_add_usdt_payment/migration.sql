-- AlterEnum: Update PayChannel to only have usdt
BEGIN;

-- Drop existing enum values
ALTER TYPE "PayChannel" RENAME TO "PayChannel_old";

-- Create new enum with only usdt
CREATE TYPE "PayChannel" AS ENUM ('usdt');

-- Update orders table to use new enum (set all existing to usdt)
ALTER TABLE "orders" ALTER COLUMN "payChannel" TYPE "PayChannel" USING 'usdt'::"PayChannel";

-- Drop old enum
DROP TYPE "PayChannel_old";

COMMIT;

-- AlterTable: Update orders table structure (separate ALTER statements)
ALTER TABLE "orders" RENAME COLUMN "amountUSD" TO "totalUSD";

ALTER TABLE "orders" DROP COLUMN "amountCNY";

ALTER TABLE "orders" RENAME COLUMN "contactNote" TO "noteFromUser";

ALTER TABLE "orders" ADD COLUMN "activationLink" TEXT;

ALTER TABLE "orders" ADD COLUMN "apiKey" TEXT;
