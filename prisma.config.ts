import "dotenv/config";
import { defineConfig, env } from "prisma/config";


console.log(env("DATABASE_URL"));
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "ts-node src/database/seeds/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
