/*
  Warnings:

  - You are about to drop the column `pay_at` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "pay_at",
ADD COLUMN     "payAt" TIMESTAMP(6);
