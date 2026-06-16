import { z } from 'zod'

export const loginSchema = z.object({
  login: z
    .string()
    .min(1, 'E-mail ou username obrigatório')
    .max(200)
    .transform((v) => v.trim().replace(/^@/, '')), // strip leading @
  password: z.string().min(1, 'Senha obrigatória').max(200),
  remember: z.boolean().optional().default(false),
})

export type LoginInput = z.infer<typeof loginSchema>
