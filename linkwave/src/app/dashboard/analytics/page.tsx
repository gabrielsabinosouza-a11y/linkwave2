import { createClient } from '@/lib/supabase/server'
import AnalyticsDashboard from '@/features/analytics/AnalyticsDashboard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Analytics' }

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', user!.id).single()

  const since = new Date(Date.now() - 30 * 86400000).toISOString()
  const [{ data: events }, { data: analytics }, { data: links }] = await Promise.all([
    supabase.from('click_events').select('*').eq('profile_id', profile?.id).gte('created_at', since),
    supabase.from('analytics').select('*').eq('profile_id', profile?.id).single(),
    supabase.from('links').select('id,title,clicks').eq('profile_id', profile?.id).order('clicks', { ascending: false }).limit(10),
  ])

  return <AnalyticsDashboard events={events ?? []} analytics={analytics} topLinks={links ?? []} />
}
