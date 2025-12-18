-- CreateTable
CREATE TABLE "send_mail_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "to" TEXT NOT NULL,
    "name_recruiter" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "vacancy" TEXT NOT NULL,
    "userId" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "send_mail_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "send_mail_users_to_key" ON "send_mail_users"("to");
