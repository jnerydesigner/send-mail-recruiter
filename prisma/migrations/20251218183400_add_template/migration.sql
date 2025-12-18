/*
  Warnings:

  - Added the required column `template` to the `send_mail_users` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_send_mail_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "to" TEXT NOT NULL,
    "name_recruiter" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "vacancy" TEXT NOT NULL,
    "userId" TEXT,
    "template" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "send_mail_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_send_mail_users" ("company", "created_at", "id", "name_recruiter", "to", "updated_at", "userId", "vacancy") SELECT "company", "created_at", "id", "name_recruiter", "to", "updated_at", "userId", "vacancy" FROM "send_mail_users";
DROP TABLE "send_mail_users";
ALTER TABLE "new_send_mail_users" RENAME TO "send_mail_users";
CREATE UNIQUE INDEX "send_mail_users_to_key" ON "send_mail_users"("to");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
