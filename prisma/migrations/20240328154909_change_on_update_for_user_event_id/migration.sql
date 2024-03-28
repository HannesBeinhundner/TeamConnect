-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "public_User_eventId_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "public_User_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE SET NULL;
