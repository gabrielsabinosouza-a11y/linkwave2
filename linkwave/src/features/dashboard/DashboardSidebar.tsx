'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Link2, Palette, BarChart3, Settings, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Profile } from '@/types'

const nav = [
  { href: '/dashboard', label: 'Visão Geral', Icon: LayoutDashboard },
  { href: '/dashboard/links', label: 'Links', Icon: Link2 },
  { href: '/dashboard/appearance', label: 'Aparência', Icon: Palette },
  { href: '/dashboard/analytics', label: 'Analytics', Icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Configurações', Icon: Settings },
]

export default function DashboardSidebar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-white/40 bg-white/30 backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-3 p-6 border-b border-white/40">
        <Image src="/imgs/icons/favicon.png" alt="LinkWave" width={36} height={36} className="rounded-xl" />
        <span className="font-black text-lg text-ocean">LinkWave</span>
      </Link>

      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ href, label, Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all',
                active
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-200'
                  : 'text-slate-600 hover:bg-white/60 hover:text-ocean',
              )}
            >
              <Icon size={17} />
              {label}
            </Link>
          )
        })}
      </nav>

      {profile && (
        <div className="p-4 border-t border-white/40">
          <Link
            href={`/${profile.username}`}
            target="_blank"
            className="flex items-center gap-2 text-sm text-ocean-light hover:text-ocean font-semibold transition-colors"
          >
            <ExternalLink size={14} />
            Ver minha página
          </Link>
        </div>
      )}
    </aside>
  )
}
