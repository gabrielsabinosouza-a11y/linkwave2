import type { Metadata } from 'next'
import LandingBackground from '@/features/landing/LandingBackground'

export const metadata: Metadata = { title: 'Autenticação' }

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <LandingBackground />
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  )
}
