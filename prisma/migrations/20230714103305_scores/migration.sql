/*
  Warnings:

  - You are about to drop the column `userId` on the `Score` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_userId_fkey";

-- AlterTable
ALTER TABLE "Score" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_ScoreToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ScoreToUser_AB_unique" ON "_ScoreToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ScoreToUser_B_index" ON "_ScoreToUser"("B");

-- AddForeignKey
ALTER TABLE "_ScoreToUser" ADD CONSTRAINT "_ScoreToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Score"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScoreToUser" ADD CONSTRAINT "_ScoreToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
