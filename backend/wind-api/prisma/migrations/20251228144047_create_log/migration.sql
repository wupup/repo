-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "level" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "meta" JSON,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);
