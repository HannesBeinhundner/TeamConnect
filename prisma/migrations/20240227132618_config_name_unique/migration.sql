/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Configuration` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Configuration_name_key" ON "Configuration"("name");
