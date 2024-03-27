/*
  Warnings:

  - A unique constraint covering the columns `[eventId,name]` on the table `EventExpertise` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[eventId,name]` on the table `EventProjectType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EventExpertise_eventId_name_key" ON "EventExpertise"("eventId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "EventProjectType_eventId_name_key" ON "EventProjectType"("eventId", "name");
