-- AlterTable
ALTER TABLE "Buy" ALTER COLUMN "newPru" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "priceOfShare" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Portfolio" ALTER COLUMN "gainOrLost" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "liquidity" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "moneyInput" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "portfolioValue" SET DATA TYPE DOUBLE PRECISION;
