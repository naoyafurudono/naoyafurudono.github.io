/*
  Warnings:

  - You are about to drop the column `authorID` on the `Post` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `systemID` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userID` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorId` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorID_fkey";

-- DropIndex
DROP INDEX "User_userID_key";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "authorID",
ADD COLUMN     "authorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "systemID",
DROP COLUMN "userID",
ADD COLUMN     "systemId" SERIAL NOT NULL,
ADD COLUMN     "userId" VARCHAR(255) NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("systemId");

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("systemId") ON DELETE RESTRICT ON UPDATE CASCADE;
