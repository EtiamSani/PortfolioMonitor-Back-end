/*
  Warnings:

  - Added the required column `numberOfStocks` to the `Sell` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sell" ADD COLUMN     "numberOfStocks" INTEGER NOT NULL,
ADD COLUMN     "priceOfShare" DOUBLE PRECISION;
