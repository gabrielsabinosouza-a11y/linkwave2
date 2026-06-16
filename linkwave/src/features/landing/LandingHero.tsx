'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { UserPlus, ArrowRight, CheckCircle } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

interface Props {
  isLoggedIn: boolean
  stats: { users: number; clicks: number }
}

export default function LandingHero({ isLoggedIn, stats }: Props) {
  return (
    <section className="container mx-auto px-4 py-20 md:py-28">
      <motion.div
        className="text-center max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-5">
          <span
            className="inline-block rounded-full px-4 py-1.5 text-sm font-bold text-ocean-light"
            style={{
              background: 'rgba(255,255,255,0.55)',
              border: '1.5px solid rgba(255,255,255,0.8)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
            }}
          >
            ✦ LinkWave v1.0 — Crie sua onda
          </span>
        </div>

        <div className="flex justify-center mb-8">
          <Image
            src="/imgs/icons/favicon.png"
            alt="LinkWave"
            width={144}
            height={144}
            className="float-logo"
            priority
          />
        </div>

        <h1
          className="font-black text-5xl md:text-7xl text-ocean mb-5 leading-tight"
          style={{ textShadow: '0 2px 0 rgba(255,255,255,0.88)' }}
        >
          Sua onda de{' '}
          <span className="text-white drop-shadow-lg">links pessoais</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-ocean mb-10 leading-relaxed max-w-xl mx-auto">
          Uma página única e compartilhável com todos os seus links.
          Simples de criar, impossível de ignorar.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {isLoggedIn ? (
            <Link href="/dashboard" className="btn-cta flex items-center gap-2">
              <ArrowRight size={18} /> Acessar dashboard
            </Link>
          ) : (
            <>
              <Link href="/auth/register" className="btn-cta flex items-center gap-2">
                <UserPlus size={18} /> Pegar minha onda
              </Link>
              <Link href="/auth/login" className="btn-outline flex items-center gap-2">
                Já tenho conta →
              </Link>
            </>
          )}
        </div>

        <p className="mt-6 text-muted-ocean text-sm flex items-center justify-center gap-1">
          <CheckCircle size={14} color="#28b060" />
          Gratuito · Sem cartão de crédito
        </p>

        <div className="flex justify-center gap-5 mt-16 flex-wrap">
          {[
            { label: 'Usuários', value: `${formatNumber(stats.users)}+` },
            { label: 'Cliques', value: `${formatNumber(stats.clicks)}+` },
            { label: 'Satisfação', value: '99%' },
          ].map((s) => (
            <motion.div
              key={s.label}
              className="text-center px-8 py-5 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.5)',
                border: '1.5px solid rgba(255,255,255,0.8)',
                boxShadow: '0 4px 16px rgba(80,180,220,0.15)',
              }}
              whileHover={{ y: -4, scale: 1.03 }}
            >
              <div className="font-black text-2xl text-ocean-light">{s.value}</div>
              <div className="text-muted-ocean text-sm mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
