import z from 'zod';

export const createRoleSchema = z.object({
  roleName: z.string().min(1),
  description: z.string().optional(),
});

export type CreateRoleBody = z.infer<typeof createRoleSchema>;
