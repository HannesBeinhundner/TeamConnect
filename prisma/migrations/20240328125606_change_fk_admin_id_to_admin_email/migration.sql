/*
  Warnings:

  - You are about to drop the column `admin` on the `Event` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_admin_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "admin",
ADD COLUMN     "adminEmail" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_adminEmail_fkey" FOREIGN KEY ("adminEmail") REFERENCES "User"("email") ON DELETE SET NULL ON UPDATE CASCADE;
