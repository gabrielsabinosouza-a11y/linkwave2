'use server'

import { redirect } from 'next/navigation'
import { loginSchema } from '@/lib/validations/login'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export type LoginState = {
  errors?: Partial<Record<'login' | 'password' | 'root', string[]>>
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  // 1. Validate input
  const parsed = loginSchema.safeParse({
    login: formData.get('login'),
    password: formData.get('password'),
    remember: formData.get('remember') === 'on',
  })

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as LoginState['errors'] }
  }

  const { login, password } = parsed.data

  // 2. Resolve email from username if needed
  let email = login
  const isEmail = login.includes('@') && login.includes('.')

  if (!isEmail) {
    // It's a username — look up the email via admin client (bypasses RLS)
    const admin = createAdminClient()
    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('user_id')
      .eq('username', login.toLowerCase())
      .single()

    if (profileError || !profile) {
      // Generic message — do not reveal if username exists
      return { errors: { root: ['E-mail/username ou senha incorretos'] } }
    }

    // Get the email from auth.users via admin
    const { data: userData, error: userError } = await admin.auth.admin.getUserById(
      profile.user_id,
    )

    if (userError || !userData.user?.email) {
      return { errors: { root: ['E-mail/username ou senha incorretos'] } }
    }

    email = userData.user.email
  }

  // 3. Sign in with Supabase Auth
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { errors: { root: ['E-mail/username ou senha incorretos'] } }
  }

  redirect('/dashboard')
}
