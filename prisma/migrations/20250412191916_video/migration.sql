/*
  Warnings:

  - You are about to drop the column `cdn_url` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the column `origin_url` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the column `video_metadata_id` on the `videos` table. All the data in the column will be lost.
  - Added the required column `cloud_file_id` to the `videos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cloud_file_path` to the `videos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `videos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `videos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `videos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `videos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `videos` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "videos_video_metadata_id_key";

-- AlterTable
ALTER TABLE "videos" DROP COLUMN "cdn_url",
DROP COLUMN "origin_url",
DROP COLUMN "video_metadata_id",
ADD COLUMN     "cloud_file_id" TEXT NOT NULL,
ADD COLUMN     "cloud_file_path" TEXT NOT NULL,
ADD COLUMN     "duration" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "height" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "is_private" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "size" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL,
ADD COLUMN     "width" DOUBLE PRECISION NOT NULL;
