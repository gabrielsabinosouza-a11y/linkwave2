import { createClient } from '@/lib/supabase/server'
import DashboardOverview from '@/features/dashboard/DashboardOverview'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profile }, { data: links }] = await Promise.all([
    supabase.from('profiles').select('*').eq('user_id', user!.id).single(),
    supabase.from('links').select('*').eq('profile_id', user!.id).order('order_index'),
  ])

  const { data: analytics } = await supabase
    .from('analytics')
    .select('*')
    .eq('profile_id', profile?.id)
    .single()

  return <DashboardOverview profile={profile} links={links ?? []} analytics={analytics} />
}
