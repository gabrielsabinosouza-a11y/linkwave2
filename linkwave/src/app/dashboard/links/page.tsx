import { createClient } from '@/lib/supabase/server'
import LinksManager from '@/features/dashboard/LinksManager'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Links' }

export default async function LinksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', user!.id).single()
  const { data: links } = await supabase.from('links').select('*').eq('profile_id', profile?.id).order('order_index')

  return <LinksManager profileId={profile?.id} initialLinks={links ?? []} />
}
