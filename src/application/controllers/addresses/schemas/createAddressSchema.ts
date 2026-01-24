import z from 'zod';

export const createAddressSchema = z.object({
  address: z.object({
    name: z.string().min(3, '"name" should be at least 3 characters long').max(50),
    street: z.string().min(8, '"street" should be at least 8 characters long').max(100),
    number: z.string().min(1, '"number" should be at least 1 characters long').max(20),
    state: z.string().min(2, '"state" should be at least 2 characters long').max(20),
    postalCode: z.string().min(8, '"postalCode" should be at least 8 characters long').max(20),
  }),
});

export type CreateAddressBody = z.infer<typeof createAddressSchema>;
