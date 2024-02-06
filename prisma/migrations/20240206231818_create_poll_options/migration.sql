-- CreateTable
CREATE TABLE "PollOption" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "poll_Id" TEXT NOT NULL,

    CONSTRAINT "PollOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PollOption_id_key" ON "PollOption"("id");

-- AddForeignKey
ALTER TABLE "PollOption" ADD CONSTRAINT "PollOption_poll_Id_fkey" FOREIGN KEY ("poll_Id") REFERENCES "poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
