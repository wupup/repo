-- CreateTable
CREATE TABLE "Count" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "count" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Count_pkey" PRIMARY KEY ("id")
);
