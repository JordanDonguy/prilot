/*
  Warnings:

  - A unique constraint covering the columns `[provider,createdById]` on the table `ProviderInstallation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdById` to the `ProviderInstallation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProviderInstallation" ADD COLUMN     "createdById" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "ProviderInstallation_createdById_idx" ON "ProviderInstallation"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderInstallation_provider_createdById_key" ON "ProviderInstallation"("provider", "createdById");

-- AddForeignKey
ALTER TABLE "ProviderInstallation" ADD CONSTRAINT "ProviderInstallation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
