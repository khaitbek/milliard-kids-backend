/*
  Warnings:

  - Added the required column `fullname` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Skill" AS ENUM ('COMMUNICATION', 'CRITICAL_THINKING', 'PROBLEM_SOLVING', 'IMPLEMENTATION');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fullname" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Score" (
    "id" TEXT NOT NULL,
    "skill" "Skill" NOT NULL DEFAULT 'COMMUNICATION',
    "scores" INTEGER[],
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
