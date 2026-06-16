import AuthForm from '@/features/auth/AuthForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Criar conta' }

export default function RegisterPage() {
  return <AuthForm mode="register" />
}
