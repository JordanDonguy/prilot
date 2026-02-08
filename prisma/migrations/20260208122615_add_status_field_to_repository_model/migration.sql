-- CreateEnum
CREATE TYPE "RepositoryStatus" AS ENUM ('active', 'deleted');

-- AlterTable
ALTER TABLE "Repository" ADD COLUMN     "status" "RepositoryStatus" NOT NULL DEFAULT 'active';
