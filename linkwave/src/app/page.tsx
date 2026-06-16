import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import LandingHero from '@/features/landing/LandingHero'
import LandingSteps from '@/features/landing/LandingSteps'
import LandingFeatures from '@/features/landing/LandingFeatures'
import LandingThemes from '@/features/landing/LandingThemes'
import LandingCTA from '@/features/landing/LandingCTA'
import LandingNav from '@/features/landing/LandingNav'
import LandingFooter from '@/features/landing/LandingFooter'
import LandingBackground from '@/features/landing/LandingBackground'

async function getStats() {
  const supabase = await createClient()
  const [{ count: users }, { count: clicks }] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('click_events').select('id', { count: 'exact', head: true }),
  ])
  return { users: users ?? 0, clicks: clicks ?? 0 }
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const stats = await getStats().catch(() => ({ users: 0, clicks: 0 }))

  return (
    <main className="relative overflow-x-hidden">
      <LandingBackground />
      <div className="relative z-10">
        <LandingNav isLoggedIn={!!user} />
        <Suspense>
          <LandingHero isLoggedIn={!!user} stats={stats} />
        </Suspense>
        <LandingSteps />
        <LandingFeatures />
        <LandingThemes />
        <LandingCTA isLoggedIn={!!user} stats={stats} />
        <LandingFooter />
      </div>
    </main>
  )
}
