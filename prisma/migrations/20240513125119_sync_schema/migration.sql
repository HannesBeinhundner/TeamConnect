-- CreateTable
CREATE TABLE "VisitorTracker" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "device" VARCHAR,

    CONSTRAINT "VisitorTracker_pkey" PRIMARY KEY ("id")
);
