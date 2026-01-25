import { z } from 'zod';

const schema = z.object({
  COGNITO_CLIENT_ID: z.string().min(1),
  COGNITO_CLIENT_SECRET: z.string().min(1),
  MAIN_TABLE_NAME: z.string().min(1),
  PRODUCTS_BUCKET: z.string().min(1),
  PRODUCTS_CDN_DOMAIN_NAME: z.string().min(1),
});

export const env = schema.parse(process.env);
