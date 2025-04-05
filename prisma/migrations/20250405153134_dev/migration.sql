-- DropIndex
DROP INDEX "Like_createdAt_idx";

-- CreateIndex
CREATE INDEX "Like_createdAt_postId_idx" ON "Like"("createdAt", "postId");
