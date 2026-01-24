/*
  Warnings:

  - You are about to drop the column `joinedAt` on the `repository_members` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "repository_members" DROP COLUMN "joinedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
