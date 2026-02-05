import { z } from 'zod';

export const CreateUserSchema = z.object({
    email: z.string().regex(/^[a-z0-9]+$/, 'El email debe ser en minúsculas y sin espacios')
        .min(2, 'El email es requerido'),
    full_name: z.string().min(2, 'El nombre completo es requerido'),
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;