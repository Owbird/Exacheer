/*
  Warnings:

  - You are about to drop the column `profileId` on the `Program` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Program` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Program" DROP CONSTRAINT "Program_profileId_fkey";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Program" DROP COLUMN "profileId",
ADD COLUMN     "userId" TEXT NOT NULL;
