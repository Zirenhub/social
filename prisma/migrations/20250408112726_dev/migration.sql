-- DropIndex
DROP INDEX "Comment_createdAt_idx";

-- CreateIndex
CREATE INDEX "Comment_createdAt_id_idx" ON "Comment"("createdAt", "id");
