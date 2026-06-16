import { createClient } from '@/lib/supabase/server'
import AppearanceEditor from '@/features/dashboard/AppearanceEditor'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Aparência' }

export default async function AppearancePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', user!.id).single()

  return <AppearanceEditor profile={profile} />
}
