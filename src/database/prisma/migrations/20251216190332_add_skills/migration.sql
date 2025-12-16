/*
  Warnings:

  - You are about to drop the column `userId` on the `skills` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `skills` table without a default value. This is not possible if the table is not empty.
  - Added the required column `curriculo_url` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `github_avatar` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialty` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_skills" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "skills_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_skills" ("id", "name") SELECT "id", "name" FROM "skills";
DROP TABLE "skills";
ALTER TABLE "new_skills" RENAME TO "skills";
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "curriculo_url" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "github_avatar" TEXT NOT NULL
);
INSERT INTO "new_users" ("email", "id", "name") SELECT "email", "id", "name" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
