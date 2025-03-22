/*
  Warnings:

  - You are about to drop the column `description` on the `videos` table. All the data in the column will be lost.
  - Added the required column `normalized_title` to the `videos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `videos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "videos" DROP COLUMN "description",
ADD COLUMN     "normalized_title" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
