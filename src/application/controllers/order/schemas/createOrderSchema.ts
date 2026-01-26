import { z } from 'zod';

const productIdSchema = z.string().min(1, '"productId" should be at least 1 characters long');

export const createOrderSchema = z.object({
  address: z.object({
    name: z
      .string()
      .min(3, '"name" should be at least 3 characters long')
      .max(50, '"name" should be at most 50 characters long'),

    street: z
      .string()
      .min(8, '"street" should be at least 8 characters long')
      .max(100, '"street" should be at most 100 characters long'),

    number: z
      .string()
      .min(1, '"number" should be at least 1 character long')
      .max(20, '"number" should be at most 20 characters long'),

    state: z
      .string()
      .min(2, '"state" should be at least 2 characters long')
      .max(20, '"state" should be at most 20 characters long'),

    postalCode: z
      .string()
      .min(8, '"postalCode" should be at least 8 characters long')
      .max(20, '"postalCode" should be at most 20 characters long'),
  }),

  products: z
    .array(productIdSchema)
    .min(1, '"products" must contain at least one item')
    .max(100, '"products" cannot contain more than 100 items'),
});

export type CreateOrderBody = z.infer<typeof createOrderSchema>;
