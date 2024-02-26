/*
  Warnings:

  - You are about to drop the `milestone` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "milestone";

-- CreateTable
CREATE TABLE "Milestone" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "configurationId" INTEGER NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Configuration" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Configuration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Milestone_configurationId_key" ON "Milestone"("configurationId");

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "Configuration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
