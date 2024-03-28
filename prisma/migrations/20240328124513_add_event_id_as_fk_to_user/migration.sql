-- AlterTable
ALTER TABLE "User" ADD COLUMN     "eventId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "public_User_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
