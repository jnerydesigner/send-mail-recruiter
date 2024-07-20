import * as dotenv from 'dotenv';
dotenv.config();

import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().transform((v) => Number(v)),
  MAIL_HOST: z.string(),
  MAIL_PORT: z.string().transform((v) => Number(v)),
  MAIL_USER: z.string(),
  MAIL_PASS: z.string(),
  MAIL_SSL: z.string().transform((v) => Boolean(v)),
});

export const env = envSchema.parse(process.env);
