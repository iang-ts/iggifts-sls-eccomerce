import z from 'zod';

import { mbToBytes } from '@shared/utils/mbToBytes';

const MAX_FILE_SIZE_MB = 10;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Name must have at least 3 characters')
    .max(120, 'Name must have at most 120 characters'),

  description: z
    .string()
    .trim()
    .min(10, 'Description must have at least 10 characters')
    .max(1000, 'Description must have at most 1000 characters'),

  price: z
    .number()
    .int('Price must be an integer (use cents)')
    .positive('Price must be greater than zero'),

  category: z
    .string()
    .trim()
    .min(2, 'Category must have at least 2 characters')
    .max(60, 'Category must have at most 60 characters'),

  stockQuantity: z
    .number()
    .int('Stock quantity must be an integer')
    .min(0, 'Stock quantity cannot be negative'),

  file: z.object({
    filename: z
      .string()
      .trim()
      .min(1, 'Filename is required'),

    size: z
      .number()
      .int('File size must be an integer')
      .positive('File size must be greater than zero')
      .max(mbToBytes(MAX_FILE_SIZE_MB), `File size must be at most ${MAX_FILE_SIZE_MB}MB`),

    inputType: z
      .string()
      .refine((type) => ALLOWED_FILE_TYPES.includes(type), {
        message: `File type must be one of: ${ALLOWED_FILE_TYPES.join(', ')}`,
      }),
  }),
});

export type CreateProductBody = z.infer<typeof createProductSchema>;
