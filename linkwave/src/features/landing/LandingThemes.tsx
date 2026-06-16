'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { THEME_PRESETS } from '@/types'
import { themePresets } from '@/lib/themes'

const previewLinks = ['Instagram', 'YouTube', 'Portfolio', 'Twitter']

export default function LandingThemes() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="container mx-auto px-4 py-20" ref={ref}>
      <div className="text-center mb-12">
        <span className="inline-block rounded-full px-4 py-1.5 text-sm font-bold text-ocean-light"
          style={{ background: 'rgba(255,255,255,0.55)', border: '1.5px solid rgba(255,255,255,0.8)' }}>
          Temas
        </span>
        <h2 className="font-black text-4xl text-ocean mt-4" style={{ textShadow: '0 2px 0 rgba(255,255,255,0.5)' }}>
          Dezenas de estilos prontos
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
        {THEME_PRESETS.map((preset, i) => {
          const theme = themePresets[preset]
          const btn = theme.buttons
          return (
            <motion.div
              key={preset}
              className="rounded-2xl overflow-hidden cursor-pointer"
              style={{ border: '2px solid rgba(255,255,255,0.6)', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              whileHover={{ scale: 1.05, y: -4 }}
            >
              <div
                className="p-3 flex flex-col items-center gap-1.5 min-h-[130px] justify-center"
                style={{ background: theme.background.value }}
              >
                <div
                  className="text-[9px] font-black uppercase tracking-wider mb-1"
                  style={{ color: theme.typography.color }}
                >
                  {preset}
                </div>
                {previewLinks.slice(0, 3).map((l) => (
                  <div
                    key={l}
                    className="w-full text-center text-[8px] font-bold py-1 px-2"
                    style={{
                      background: btn.color,
                      color: btn.textColor,
                      borderRadius: btn.radius === '999px' ? '999px' : '4px',
                      boxShadow: btn.shadow,
                      border: '1px solid rgba(255,255,255,0.3)',
                    }}
                  >
                    {l}
                  </div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
