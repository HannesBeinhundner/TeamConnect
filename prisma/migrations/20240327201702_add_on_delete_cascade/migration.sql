-- DropForeignKey
ALTER TABLE "EventExpertise" DROP CONSTRAINT "EventExpertise_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventProjectType" DROP CONSTRAINT "EventProjectType_eventId_fkey";

-- AddForeignKey
ALTER TABLE "EventProjectType" ADD CONSTRAINT "EventProjectType_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventExpertise" ADD CONSTRAINT "EventExpertise_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
