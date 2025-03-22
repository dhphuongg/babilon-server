/*
  Warnings:

  - You are about to drop the `Social` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Social" DROP CONSTRAINT "Social_user_id_fkey";

-- DropTable
DROP TABLE "Social";

-- CreateTable
CREATE TABLE "social_graph" (
    "id" TEXT NOT NULL,
    "following" TEXT[],
    "followers" TEXT[],
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_graph_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "social_graph_user_id_key" ON "social_graph"("user_id");

-- AddForeignKey
ALTER TABLE "social_graph" ADD CONSTRAINT "social_graph_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
