'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { UserPlus, ArrowRight } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

interface Props {
  isLoggedIn: boolean
  stats: { users: number; clicks: number }
}

export default function LandingCTA({ isLoggedIn, stats }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="container mx-auto px-4 py-24" ref={ref}>
      <motion.div
        className="glass-strong p-12 text-center max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <Image src="/imgs/icons/favicon.png" alt="LinkWave" width={80} height={80} className="mx-auto mb-6 float-logo" />
        <h2 className="font-black text-4xl text-ocean mb-4" style={{ textShadow: '0 2px 0 rgba(255,255,255,0.5)' }}>
          Vamos surfar juntos?
        </h2>
        <p className="text-muted-ocean mb-8 leading-relaxed text-lg">
          Mais de {formatNumber(stats.users)} pessoas já estão na onda.<br />
          Crie sua página em menos de 2 minutos.
        </p>
        {isLoggedIn ? (
          <Link href="/dashboard" className="btn-cta flex items-center gap-2 w-fit mx-auto">
            <ArrowRight size={18} /> Acessar Dashboard
          </Link>
        ) : (
          <Link href="/auth/register" className="btn-cta flex items-center gap-2 w-fit mx-auto">
            <UserPlus size={18} /> Começar agora — grátis
          </Link>
        )}
      </motion.div>
    </section>
  )
}
