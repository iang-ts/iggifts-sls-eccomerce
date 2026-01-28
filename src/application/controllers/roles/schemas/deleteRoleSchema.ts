import z from 'zod';

export const deleteRoleSchema = z.object({
  roleName: z.string().min(1),
});

export type DeleteRoleBody = z.infer<typeof deleteRoleSchema>;
