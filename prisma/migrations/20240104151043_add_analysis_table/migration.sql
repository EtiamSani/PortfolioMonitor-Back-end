-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL,
    "file" BYTEA NOT NULL,
    "fairValue" DOUBLE PRECISION,
    "stockCategory" TEXT,
    "peaOrCto" TEXT,
    "entryPoint" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "portfolioOwnerId" TEXT NOT NULL,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_portfolioOwnerId_fkey" FOREIGN KEY ("portfolioOwnerId") REFERENCES "PortfolioOwner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
