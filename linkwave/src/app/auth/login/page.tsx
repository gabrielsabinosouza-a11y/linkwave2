import AuthForm from '@/features/auth/AuthForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Entrar' }

export default function LoginPage() {
  return <AuthForm mode="login" />
}
