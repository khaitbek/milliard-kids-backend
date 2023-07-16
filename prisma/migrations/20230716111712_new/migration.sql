/*
  Warnings:

  - You are about to drop the `_ScoreToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ScoreToUser" DROP CONSTRAINT "_ScoreToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ScoreToUser" DROP CONSTRAINT "_ScoreToUser_B_fkey";

-- AlterTable
ALTER TABLE "Score" ADD COLUMN     "userId" TEXT;

-- DropTable
DROP TABLE "_ScoreToUser";

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
