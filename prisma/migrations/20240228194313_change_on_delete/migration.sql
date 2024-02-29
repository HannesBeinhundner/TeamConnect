-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_projectId_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
