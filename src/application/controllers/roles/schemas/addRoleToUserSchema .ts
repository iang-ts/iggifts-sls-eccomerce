import z from 'zod';

export const addRoleToUserSchema = z.object({
  roleName: z.string().min(1),
  email: z.string().email().min(1),
});

export type AddRoleToUserBody = z.infer<typeof addRoleToUserSchema>;
