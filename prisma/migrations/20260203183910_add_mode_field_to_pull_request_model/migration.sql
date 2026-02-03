-- CreateEnum
CREATE TYPE "PullRequestMode" AS ENUM ('fast', 'deep');

-- AlterTable
ALTER TABLE "pull_requests" ADD COLUMN     "mode" "PullRequestMode" NOT NULL DEFAULT 'fast';
