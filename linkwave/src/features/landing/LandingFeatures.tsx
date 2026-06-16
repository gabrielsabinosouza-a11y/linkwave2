'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Palette, Infinity, BarChart3, Smartphone } from 'lucide-react'

const features = [
  { Icon: Palette, title: 'Personalização total', desc: 'Cores, temas e estilos. Sua página com sua cara, fluindo do seu jeito.' },
  { Icon: Infinity, title: 'Links ilimitados', desc: 'Adicione quantos links quiser e organize com ícones personalizados.' },
  { Icon: BarChart3, title: 'Estatísticas em tempo real', desc: 'Veja quantas pessoas estão surfando na sua onda.' },
  { Icon: Smartphone, title: '100% responsivo', desc: 'Perfeito em qualquer dispositivo, do celular ao PC.' },
]

export default function LandingFeatures() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="container mx-auto px-4 py-20" ref={ref}>
      <div className="text-center mb-12">
        <span className="inline-block rounded-full px-4 py-1.5 text-sm font-bold text-ocean-light"
          style={{ background: 'rgba(255,255,255,0.55)', border: '1.5px solid rgba(255,255,255,0.8)' }}>
          Recursos
        </span>
        <h2 className="font-black text-4xl text-ocean mt-4" style={{ textShadow: '0 2px 0 rgba(255,255,255,0.5)' }}>
          Tudo que você precisa
        </h2>
      </div>
      <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            className="glass p-6 flex items-start gap-5"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            whileHover={{ y: -3 }}
          >
            <div
              className="w-14 h-14 rounded-[18px] flex items-center justify-center shrink-0"
              style={{
                background: 'linear-gradient(180deg,rgba(255,255,255,0.9),rgba(210,240,255,0.7))',
                border: '1.5px solid rgba(255,255,255,0.9)',
                boxShadow: '0 4px 12px rgba(80,180,220,0.2)',
              }}
            >
              <f.Icon size={22} className="text-ocean-light" />
            </div>
            <div>
              <h3 className="font-bold text-ocean mb-1">{f.title}</h3>
              <p className="text-muted-ocean text-sm leading-relaxed">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
