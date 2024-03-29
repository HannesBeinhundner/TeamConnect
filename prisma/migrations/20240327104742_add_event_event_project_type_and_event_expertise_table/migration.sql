-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "isPartOfEvent" BOOLEAN NOT NULL DEFAULT true,
    "hasMileStones" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventProjectType" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "eventId" INTEGER,

    CONSTRAINT "EventProjectType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventExpertise" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "eventId" INTEGER,

    CONSTRAINT "EventExpertise_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventProjectType" ADD CONSTRAINT "EventProjectType_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventExpertise" ADD CONSTRAINT "EventExpertise_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
