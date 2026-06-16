import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (!code) return NextResponse.redirect(`${origin}/auth/login?error=missing_code`)

  const supabase = await createClient()
  const { error, data } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`)
  }

  // Ensure profile exists for OAuth users (Google, GitHub, Discord)
  const admin = createAdminClient()
  const { count } = await admin
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', data.user.id)

  if (count === 0) {
    const meta = data.user.user_metadata
    // Generate a unique username from email or provider name
    const baseUsername = (meta?.preferred_username ?? meta?.name ?? meta?.email ?? 'user')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '')
      .slice(0, 28)
    const username = `${baseUsername}${Math.floor(Math.random() * 9000) + 1000}`

    await admin.from('profiles').insert({
      user_id: data.user.id,
      username,
      display_name: meta?.full_name ?? meta?.name ?? null,
      avatar_url: meta?.avatar_url ?? meta?.picture ?? null,
      is_public: true,
      theme_config: {
        preset: 'aero',
        background: { type: 'gradient', value: 'linear-gradient(160deg,#a8edcf,#78d4f0,#4ab8f5)' },
        typography: { font: 'Nunito', size: 'md', weight: '700', align: 'center', color: '#1a6a9a' },
        buttons: { style: 'glass', radius: '999px', shadow: '0 8px 32px rgba(80,180,220,0.3)', color: 'rgba(255,255,255,0.45)', textColor: '#1a6a9a' },
        layout: { type: 'centered', maxWidth: '480px' },
      },
    })
  }

  return NextResponse.redirect(`${origin}${next}`)
}
