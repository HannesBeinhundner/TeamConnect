/*
  Warnings:

  - You are about to drop the column `hasMileStones` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "hasMileStones",
ADD COLUMN     "hasMilestones" BOOLEAN NOT NULL DEFAULT false;
