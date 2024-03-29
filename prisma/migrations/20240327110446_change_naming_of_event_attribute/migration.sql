/*
  Warnings:

  - You are about to drop the column `userId` on the `Event` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_userId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "userId",
ADD COLUMN     "admin" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_admin_fkey" FOREIGN KEY ("admin") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
