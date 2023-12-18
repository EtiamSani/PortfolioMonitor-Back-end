/*
  Warnings:

  - Added the required column `newPru` to the `Buy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfStocks` to the `Buy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Buy" ADD COLUMN     "newPru" INTEGER NOT NULL,
ADD COLUMN     "numberOfStocks" INTEGER NOT NULL;
