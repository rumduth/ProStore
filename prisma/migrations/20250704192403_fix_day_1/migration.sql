/*
  Warnings:

  - You are about to drop the column `payAt` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "payAt",
ADD COLUMN     "paidAt" TIMESTAMP(6);
