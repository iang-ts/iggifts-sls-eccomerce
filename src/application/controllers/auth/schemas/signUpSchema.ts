import z from 'zod';

export const signUpSchema = z.object({
  account: z.object({
    name: z.string().min(3, '"name" should be at least 3 characters long'),
    email: z.string().min(1, '"email" is required').email('Invalid email'),
    password: z.string().min(8, '"password" should be at least 8 characters long'),
  }),
});

export type SignUpBody = z.infer<typeof signUpSchema>;
