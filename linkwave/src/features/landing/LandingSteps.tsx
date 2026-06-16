'use client'

import { motion } from 'framer-motion'
import { UserPlus, AtSign, Link as LinkIcon } from 'lucide-react'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const steps = [
  { num: '1', Icon: UserPlus, title: 'Crie sua conta', desc: 'Cadastre-se com email e senha em segundos.' },
  { num: '2', Icon: AtSign, title: 'Escolha seu username', desc: 'Um link único e memorável só seu.' },
  { num: '3', Icon: LinkIcon, title: 'Adicione seus links', desc: 'Instagram, YouTube, site — tudo em um lugar.' },
]

function GlassCard({ children, delay }: { children: React.ReactNode; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      className="glass p-7"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4 }}
    >
      {children}
    </motion.div>
  )
}

export default function LandingSteps() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <span className="inline-block rounded-full px-4 py-1.5 text-sm font-bold text-ocean-light"
          style={{ background: 'rgba(255,255,255,0.55)', border: '1.5px solid rgba(255,255,255,0.8)' }}>
          Como funciona
        </span>
        <h2 className="font-black text-4xl text-ocean mt-4" style={{ textShadow: '0 2px 0 rgba(255,255,255,0.5)' }}>
          3 passos para surfar
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {steps.map((s, i) => (
          <GlassCard key={s.num} delay={i * 0.1}>
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center font-black text-white mb-5"
              style={{
                background: 'linear-gradient(180deg,#5bc8f5,#2aa8e0)',
                boxShadow: '0 4px 12px rgba(42,168,224,0.4)',
              }}
            >
              {s.num}
            </div>
            <div
              className="w-14 h-14 rounded-[18px] flex items-center justify-center mb-4"
              style={{
                background: 'linear-gradient(180deg,rgba(255,255,255,0.9),rgba(210,240,255,0.7))',
                border: '1.5px solid rgba(255,255,255,0.9)',
                boxShadow: '0 4px 12px rgba(80,180,220,0.2)',
              }}
            >
              <s.Icon size={22} className="text-ocean-light" />
            </div>
            <h3 className="font-bold text-lg text-ocean mb-2">{s.title}</h3>
            <p className="text-muted-ocean text-sm leading-relaxed">{s.desc}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  )
}
