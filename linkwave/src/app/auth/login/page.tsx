import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LoginForm from '@/features/auth/AuthForm'

export const metadata: Metadata = {
  title: 'Entrar',
  description: 'Acesse sua conta no LinkWave.',
}

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return <LoginForm />
}
