import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number(),
  MAIL_HOST: z.string(),
  MAIL_PORT: z.coerce.number(),
  MAIL_USER: z.string(),
  MAIL_PASS: z.string(),
  MAIL_SSL: z.coerce.boolean(),
  DATABASE_URL: z.string(),
});

export const env = envSchema.parse(process.env);
console.log(env.DATABASE_URL);