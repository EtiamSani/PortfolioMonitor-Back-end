/*
  Warnings:

  - You are about to drop the column `annualDividend` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `high52` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `low52` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `per` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `volume` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "annualDividend",
DROP COLUMN "high52",
DROP COLUMN "low52",
DROP COLUMN "per",
DROP COLUMN "volume";
