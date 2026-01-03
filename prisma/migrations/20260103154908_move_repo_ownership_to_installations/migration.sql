/*
  Warnings:

  - You are about to drop the column `createdById` on the `Repository` table. All the data in the column will be lost.
  - Added the required column `isPrivate` to the `Repository` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Repository" DROP CONSTRAINT "Repository_createdById_fkey";

-- DropIndex
DROP INDEX "Repository_createdById_idx";

-- AlterTable
ALTER TABLE "Repository" DROP COLUMN "createdById",
ADD COLUMN     "isPrivate" BOOLEAN NOT NULL;
