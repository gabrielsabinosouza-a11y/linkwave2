'use client'

import { motion } from 'framer-motion'
import { Eye, MousePointer, TrendingUp, Link2, ExternalLink, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { formatNumber, getBaseUrl } from '@/lib/utils'
import type { Profile, Link as LinkType } from '@/types'
import Link from 'next/link'

interface Props {
  profile: Profile | null
  links: LinkType[]
  analytics: { total_views: number; total_clicks: number; views_today: number; clicks_today: number } | null
}

const card = (icon: React.ReactNode, label: string, value: string, sub: string, color: string) => (
  <motion.div
    className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-white/60"
    whileHover={{ y: -2, scale: 1.01 }}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>{icon}</div>
    <div className="font-black text-2xl text-slate-800 dark:text-white">{value}</div>
    <div className="font-semibold text-slate-600 dark:text-slate-300 text-sm">{label}</div>
    <div className="text-slate-400 text-xs mt-0.5">{sub}</div>
  </motion.div>
)

export default function DashboardOverview({ profile, links, analytics }: Props) {
  const profileUrl = `${getBaseUrl()}/${profile?.username}`

  function copyUrl() {
    navigator.clipboard.writeText(profileUrl)
    toast.success('Link copiado!')
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* URL bar */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-white/60 flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-400 font-semibold mb-1">Sua página pública</p>
          <p className="font-bold text-ocean truncate">{profileUrl}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={copyUrl} className="flex items-center gap-2 text-sm bg-sky-100 hover:bg-sky-200 text-sky-700 font-semibold px-4 py-2 rounded-xl transition-colors">
            <Copy size={14} /> Copiar
          </button>
          <Link href={profileUrl} target="_blank" className="flex items-center gap-2 text-sm bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-semibold px-4 py-2 rounded-xl transition-colors">
            <ExternalLink size={14} /> Ver
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {card(<Eye size={18} className="text-sky-600" />, 'Visitas totais', formatNumber(analytics?.total_views ?? 0), 'todos os tempos', 'bg-sky-100')}
        {card(<MousePointer size={18} className="text-emerald-600" />, 'Cliques totais', formatNumber(analytics?.total_clicks ?? 0), 'todos os tempos', 'bg-emerald-100')}
        {card(<Eye size={18} className="text-violet-600" />, 'Visitas hoje', formatNumber(analytics?.views_today ?? 0), 'nas últimas 24h', 'bg-violet-100')}
        {card(<TrendingUp size={18} className="text-orange-600" />, 'Cliques hoje', formatNumber(analytics?.clicks_today ?? 0), 'nas últimas 24h', 'bg-orange-100')}
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-white/60">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-slate-800 dark:text-white">Meus links</h2>
            <Link href="/dashboard/links" className="text-sky-500 text-sm font-semibold hover:text-sky-600">Ver todos →</Link>
          </div>
          <div className="space-y-2">
            {links.slice(0, 5).map((l) => (
              <div key={l.id} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3">
                <Link2 size={14} className="text-slate-400 shrink-0" />
                <span className="flex-1 text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{l.title}</span>
                <span className="text-xs text-slate-400">{l.clicks} cliques</span>
              </div>
            ))}
            {links.length === 0 && (
              <Link href="/dashboard/links" className="block text-center py-6 text-sky-500 font-semibold text-sm hover:text-sky-600">
                + Adicionar primeiro link
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-white/60">
          <h2 className="font-black text-slate-800 dark:text-white mb-4">Ações rápidas</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/dashboard/links', label: 'Adicionar link', icon: <Link2 size={16} />, color: 'bg-sky-50 hover:bg-sky-100 text-sky-700' },
              { href: '/dashboard/appearance', label: 'Mudar tema', icon: <span>🎨</span>, color: 'bg-violet-50 hover:bg-violet-100 text-violet-700' },
              { href: '/dashboard/analytics', label: 'Ver analytics', icon: <TrendingUp size={16} />, color: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700' },
              { href: '/dashboard/settings', label: 'Editar perfil', icon: <span>👤</span>, color: 'bg-orange-50 hover:bg-orange-100 text-orange-700' },
            ].map((a) => (
              <Link key={a.href} href={a.href} className={`flex flex-col items-center gap-2 p-4 rounded-2xl font-semibold text-sm transition-colors ${a.color}`}>
                {a.icon}
                <span className="text-center text-xs leading-tight">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
