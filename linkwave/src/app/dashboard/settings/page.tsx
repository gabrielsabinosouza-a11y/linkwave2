import { createClient } from '@/lib/supabase/server'
import SettingsForm from '@/features/dashboard/SettingsForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Configurações' }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', user!.id).single()

  return <SettingsForm profile={profile} />
}
