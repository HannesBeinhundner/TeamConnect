/*
  Warnings:

  - You are about to drop the column `major` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `portfolio` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "major",
DROP COLUMN "portfolio",
ADD COLUMN     "expertise" TEXT,
ADD COLUMN     "link" TEXT;
