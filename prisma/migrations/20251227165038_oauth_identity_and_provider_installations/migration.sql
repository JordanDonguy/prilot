/*
  Warnings:

  - You are about to drop the column `providerAccountId` on the `pull_requests` table. All the data in the column will be lost.
  - You are about to drop the `provider_accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `repositories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "invitations" DROP CONSTRAINT "invitations_repositoryId_fkey";

-- DropForeignKey
ALTER TABLE "provider_accounts" DROP CONSTRAINT "provider_accounts_userId_fkey";

-- DropForeignKey
ALTER TABLE "pull_requests" DROP CONSTRAINT "pull_requests_providerAccountId_fkey";

-- DropForeignKey
ALTER TABLE "pull_requests" DROP CONSTRAINT "pull_requests_repositoryId_fkey";

-- DropForeignKey
ALTER TABLE "repositories" DROP CONSTRAINT "repositories_createdById_fkey";

-- DropForeignKey
ALTER TABLE "repository_members" DROP CONSTRAINT "repository_members_repositoryId_fkey";

-- AlterTable
ALTER TABLE "pull_requests" DROP COLUMN "providerAccountId";

-- DropTable
DROP TABLE "provider_accounts";

-- DropTable
DROP TABLE "repositories";

-- CreateTable
CREATE TABLE "user_oauth" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "provider" "Provider" NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_oauth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderInstallation" (
    "id" UUID NOT NULL,
    "provider" "Provider" NOT NULL,
    "installationId" TEXT NOT NULL,
    "accountLogin" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProviderInstallation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Repository" (
    "id" UUID NOT NULL,
    "provider" "Provider" NOT NULL,
    "providerRepoId" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "defaultBranch" TEXT NOT NULL,
    "installationId" UUID NOT NULL,
    "createdById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Repository_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_oauth_userId_idx" ON "user_oauth"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_oauth_provider_providerUserId_key" ON "user_oauth"("provider", "providerUserId");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderInstallation_provider_installationId_key" ON "ProviderInstallation"("provider", "installationId");

-- CreateIndex
CREATE INDEX "Repository_createdById_idx" ON "Repository"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "Repository_provider_providerRepoId_key" ON "Repository"("provider", "providerRepoId");

-- AddForeignKey
ALTER TABLE "user_oauth" ADD CONSTRAINT "user_oauth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_installationId_fkey" FOREIGN KEY ("installationId") REFERENCES "ProviderInstallation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repository_members" ADD CONSTRAINT "repository_members_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pull_requests" ADD CONSTRAINT "pull_requests_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
