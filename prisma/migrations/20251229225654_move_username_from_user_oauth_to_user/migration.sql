/*
  Warnings:

  - You are about to drop the column `username` on the `user_oauth` table. All the data in the column will be lost.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_oauth" DROP COLUMN "username";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "username" TEXT NOT NULL;
