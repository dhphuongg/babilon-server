/*
  Warnings:

  - You are about to drop the column `cloud_file_path` on the `videos` table. All the data in the column will be lost.
  - Added the required column `hls_url` to the `videos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "videos" DROP COLUMN "cloud_file_path",
ADD COLUMN     "hls_url" TEXT NOT NULL;
