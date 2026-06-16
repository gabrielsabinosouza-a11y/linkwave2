import { z } from 'zod'

export const usernameSchema = z
  .string()
  .min(3, 'Mínimo 3 caracteres')
  .max(30, 'Máximo 30 caracteres')
  .regex(/^[a-z0-9_-]+$/, 'Apenas letras minúsculas, números, _ e -')

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(80, 'Nome muito longo').trim(),
    email: z.string().email('E-mail inválido').toLowerCase().trim(),
    username: usernameSchema,
    password: z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
      .regex(/[0-9]/, 'Deve conter pelo menos um número'),
    confirmPassword: z.string(),
    terms: z.literal(true, { errorMap: () => ({ message: 'Você deve aceitar os termos' }) }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export type RegisterInput = z.infer<typeof registerSchema>
