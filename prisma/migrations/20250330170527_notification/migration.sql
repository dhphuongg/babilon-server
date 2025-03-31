-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('FOLLOW', 'POST_VIDEO', 'LIKE_VIDEO', 'COMMENT_VIDEO', 'SHARE_VIDEO', 'SYSTEM');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "device_tokens" TEXT[];

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "image_url" TEXT,
    "type" "NotificationType" NOT NULL,
    "video_id" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);
