-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "type" VARCHAR(256) NOT NULL,
    "supervisor" VARCHAR(256) NOT NULL,
    "description" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "file" VARCHAR(256) NOT NULL,
    "link" VARCHAR(256) NOT NULL,
    "status" VARCHAR(256) NOT NULL,
    "image" VARCHAR(256) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_name_key" ON "Project"("name");
