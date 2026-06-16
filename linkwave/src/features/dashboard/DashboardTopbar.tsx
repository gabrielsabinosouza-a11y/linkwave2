'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LogOut, User, Settings } from 'lucide-react'
import type { Profile } from '@/types'
import type { User as SupaUser } from '@supabase/supabase-js'
import Link from 'next/link'

export default function DashboardTopbar({ profile, user }: { profile: Profile | null; user: SupaUser }) {
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const initials = profile?.display_name?.slice(0, 2).toUpperCase() ?? user.email?.slice(0, 2).toUpperCase() ?? 'LW'

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/40 bg-white/30 backdrop-blur-xl">
      <div>
        <h1 className="font-black text-slate-800 dark:text-white text-lg">
          Olá, {profile?.display_name ?? profile?.username ?? 'usuário'} 👋
        </h1>
        <p className="text-slate-500 text-xs">linkwave.app/{profile?.username}</p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-full outline-none ring-2 ring-sky-200 hover:ring-sky-400 transition-all">
            <Avatar className="w-10 h-10">
              <AvatarImage src={profile?.avatar_url ?? undefined} />
              <AvatarFallback className="bg-sky-500 text-white font-bold">{initials}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings" className="flex items-center gap-2">
              <User size={14} /> Perfil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings" className="flex items-center gap-2">
              <Settings size={14} /> Configurações
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut} className="text-red-500 flex items-center gap-2">
            <LogOut size={14} /> Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
