'use client'

import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, UserPlus } from 'lucide-react'

export default function LandingNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <nav className="sticky top-0 z-50 px-4 pt-4 pb-2">
      <div className="container mx-auto">
        <div
          className="flex items-center justify-between rounded-full px-6 py-3"
          style={{
            background: 'rgba(255,255,255,0.5)',
            backdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(255,255,255,0.75)',
            boxShadow: '0 4px 20px rgba(80,180,220,0.15),inset 0 1px 0 rgba(255,255,255,0.9)',
          }}
        >
          <Link href="/" className="flex items-center gap-3">
            <Image src="/imgs/icons/favicon.png" alt="LinkWave" width={40} height={40} className="rounded-xl" />
            <span className="font-black text-xl text-ocean">LinkWave</span>
          </Link>

          {isLoggedIn ? (
            <Link href="/dashboard" className="btn-primary flex items-center gap-2 text-sm">
              <LayoutDashboard size={14} /> Dashboard
            </Link>
          ) : (
            <Link href="/auth/register" className="btn-primary flex items-center gap-2 text-sm">
              <UserPlus size={14} /> Cadastro
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
