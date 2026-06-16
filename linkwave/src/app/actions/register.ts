'use server'

import { registerSchema } from '@/lib/validations/register'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

export type RegisterState = {
  errors?: Partial<Record<'name' | 'email' | 'username' | 'password' | 'confirmPassword' | 'terms' | 'root', string[]>>
  message?: string
}

export async function registerAction(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  // 1. Parse & validate
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    username: formData.get('username'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    terms: formData.get('terms') === 'on' ? true : formData.get('terms'),
  }

  const parsed = registerSchema.safeParse(raw)
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as RegisterState['errors'] }
  }

  const { name, email, username, password } = parsed.data

  // 2. Check username uniqueness (using admin to bypass RLS)
  const admin = createAdminClient()
  const { count } = await admin
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('username', username)

  if (count && count > 0) {
    return { errors: { username: ['Este username já está em uso'] } }
  }

  // 3. Create auth user
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, username },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    // Generic message to prevent user enumeration
    if (error.message.toLowerCase().includes('already')) {
      return { errors: { email: ['Já existe uma conta com este e-mail'] } }
    }
    return { errors: { root: ['Ocorreu um erro ao criar sua conta. Tente novamente.'] } }
  }

  if (!data.user) {
    return { errors: { root: ['Ocorreu um erro inesperado. Tente novamente.'] } }
  }

  // 4. Create profile record via admin (avoids RLS on insert before email confirm)
  const { error: profileError } = await admin.from('profiles').insert({
    user_id: data.user.id,
    username,
    display_name: name,
    is_public: true,
    theme_config: {
      preset: 'aero',
      background: { type: 'gradient', value: 'linear-gradient(160deg,#a8edcf,#78d4f0,#4ab8f5)' },
      typography: { font: 'Nunito', size: 'md', weight: '700', align: 'center', color: '#1a6a9a' },
      buttons: { style: 'glass', radius: '999px', shadow: '0 8px 32px rgba(80,180,220,0.3)', color: 'rgba(255,255,255,0.45)', textColor: '#1a6a9a' },
      layout: { type: 'centered', maxWidth: '480px' },
    },
  })

  if (profileError) {
    // Rollback auth user if profile creation fails
    await admin.auth.admin.deleteUser(data.user.id)
    return { errors: { root: ['Erro ao criar perfil. Tente novamente.'] } }
  }

  // 5. If email confirmation required, show success message
  if (!data.session) {
    return { message: 'confirm-email' }
  }

  // 6. Session active (email confirm disabled) → redirect to dashboard
  redirect('/dashboard')
}
