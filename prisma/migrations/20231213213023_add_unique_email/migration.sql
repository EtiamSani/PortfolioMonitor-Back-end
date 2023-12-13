/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `PortfolioOwner` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PortfolioOwner_email_key" ON "PortfolioOwner"("email");
