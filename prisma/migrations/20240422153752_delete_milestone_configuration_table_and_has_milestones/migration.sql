/*
  Warnings:

  - You are about to drop the column `hasMilestones` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `Configuration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Milestone` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Milestone" DROP CONSTRAINT "Milestone_configurationId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "hasMilestones";

-- DropTable
DROP TABLE "Configuration";

-- DropTable
DROP TABLE "Milestone";
