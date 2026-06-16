import { z } from 'zod'

export const usernameSchema = z
  .string()
  .min(3, 'Mínimo 3 caracteres')
  .max(30, 'Máximo 30 caracteres')
  .regex(/^[a-z0-9_-]+$/, 'Apenas letras minúsculas, números, _ e -')

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  username: usernameSchema,
})

export const profileSchema = z.object({
  display_name: z.string().max(60).optional(),
  bio: z.string().max(160).optional(),
  location: z.string().max(60).optional(),
  profession: z.string().max(60).optional(),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
})

export const linkSchema = z.object({
  title: z.string().min(1, 'Título obrigatório').max(80),
  url: z.string().url('URL inválida'),
  icon: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type LinkInput = z.infer<typeof linkSchema>
