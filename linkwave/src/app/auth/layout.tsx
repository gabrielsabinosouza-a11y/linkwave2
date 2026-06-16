import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import LandingBackground from '@/features/landing/LandingBackground'

export const metadata: Metadata = { title: { default: 'Autenticação', template: '%s | LinkWave' } }

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <LandingBackground />

      {/* Minimal nav */}
      <nav className="relative z-10 px-4 pt-4">
        <div className="container mx-auto">
          <div
            className="flex items-center justify-between rounded-full px-5 py-2.5 w-fit"
            style={{
              background: 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(20px)',
              border: '1.5px solid rgba(255,255,255,0.75)',
              boxShadow: '0 4px 20px rgba(80,180,220,0.15)',
            }}
          >
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/imgs/icons/favicon.png" alt="LinkWave" width={36} height={36} className="rounded-xl" />
              <span className="font-black text-lg text-ocean">LinkWave</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-6 text-muted-ocean text-xs">
        © 2026 LinkWave — Todos os direitos reservados
      </footer>
    </div>
  )
}
