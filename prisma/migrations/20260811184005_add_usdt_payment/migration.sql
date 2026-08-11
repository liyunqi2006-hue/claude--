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

-- AlterTable: Update orders table structure
ALTER TABLE "orders"
  RENAME COLUMN "amountUSD" TO "totalUSD";

ALTER TABLE "orders"
  DROP COLUMN "amountCNY",
  RENAME COLUMN "contactNote" TO "noteFromUser",
  ADD COLUMN "activationLink" TEXT,
  ADD COLUMN "apiKey" TEXT;
