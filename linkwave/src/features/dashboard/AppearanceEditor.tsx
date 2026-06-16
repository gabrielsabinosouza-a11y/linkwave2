'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { themePresets } from '@/lib/themes'
import { THEME_PRESETS } from '@/types'
import type { Profile, ThemeConfig } from '@/types'

const supabase = createClient()
const previewLinks = ['Instagram', 'YouTube', 'Portfolio']

export default function AppearanceEditor({ profile }: { profile: Profile | null }) {
  const [theme, setTheme] = useState<ThemeConfig>(profile?.theme_config ?? themePresets.aero)
  const [saving, setSaving] = useState(false)

  async function saveTheme() {
    if (!profile) return
    setSaving(true)
    try {
      await supabase.from('profiles').update({ theme_config: theme }).eq('id', profile.id)
      toast.success('Aparência salva!')
    } catch {
      toast.error('Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-black text-2xl text-slate-800 dark:text-white">Aparência</h1>
        <button onClick={saveTheme} disabled={saving} className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold px-5 py-2.5 rounded-2xl text-sm transition-colors disabled:opacity-60">
          <Check size={16} /> {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Theme picker */}
        <div className="lg:col-span-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-white/60">
          <h2 className="font-bold text-slate-800 dark:text-white mb-4">Temas prontos</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {THEME_PRESETS.map((preset) => {
              const t = themePresets[preset]
              const active = theme.preset === preset
              return (
                <motion.button
                  key={preset}
                  onClick={() => setTheme(t)}
                  className="rounded-xl overflow-hidden border-2 transition-all"
                  style={{ borderColor: active ? '#38bdf8' : 'rgba(255,255,255,0.4)' }}
                  whileHover={{ scale: 1.04 }}
                >
                  <div className="p-2 flex flex-col items-center gap-1 min-h-[90px] justify-center relative" style={{ background: t.background.value }}>
                    {active && <div className="absolute top-1 right-1 w-4 h-4 bg-sky-500 rounded-full flex items-center justify-center"><Check size={10} className="text-white" /></div>}
                    <div className="text-[8px] font-black uppercase" style={{ color: t.typography.color }}>{preset}</div>
                    {previewLinks.map((l) => (
                      <div key={l} className="w-full text-[7px] font-bold py-0.5 text-center"
                        style={{ background: t.buttons.color, color: t.buttons.textColor, borderRadius: '4px', border: '1px solid rgba(255,255,255,0.3)' }}>
                        {l}
                      </div>
                    ))}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Live preview */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-white/60">
          <h2 className="font-bold text-slate-800 dark:text-white mb-4">Preview</h2>
          <div className="rounded-2xl overflow-hidden aspect-[9/16] relative flex flex-col items-center justify-center p-4 gap-2" style={{ background: theme.background.value }}>
            <div className="w-14 h-14 rounded-full bg-white/30 mb-2" />
            <div className="text-sm font-black" style={{ color: theme.typography.color, fontFamily: theme.typography.font }}>
              {profile?.display_name ?? '@username'}
            </div>
            <div className="text-xs opacity-70" style={{ color: theme.typography.color }}>
              {profile?.bio ?? 'Minha bio aqui'}
            </div>
            {previewLinks.map((l) => (
              <div key={l} className="w-full text-center text-xs font-bold py-2.5 px-4"
                style={{
                  background: theme.buttons.color,
                  color: theme.buttons.textColor,
                  borderRadius: theme.buttons.radius,
                  boxShadow: theme.buttons.shadow,
                  border: '1px solid rgba(255,255,255,0.3)',
                }}>
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom background */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-white/60">
        <h2 className="font-bold text-slate-800 dark:text-white mb-4">Fundo personalizado</h2>
        <div className="flex gap-3 flex-wrap">
          {(['solid', 'gradient', 'image'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTheme((prev) => ({ ...prev, background: { ...prev.background, type } }))}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${theme.background.type === type ? 'bg-sky-500 text-white border-sky-500' : 'bg-white/50 text-slate-600 border-white/60 hover:bg-white/80'}`}
            >
              {type === 'solid' ? 'Sólido' : type === 'gradient' ? 'Gradiente' : 'Imagem'}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <label className="text-sm font-semibold text-slate-600">Valor (cor, gradiente ou URL)</label>
          <input
            className="w-full mt-1 bg-white/50 border border-white/70 rounded-xl px-3 py-2 text-sm"
            value={theme.background.value}
            onChange={(e) => setTheme((prev) => ({ ...prev, background: { ...prev.background, value: e.target.value } }))}
            placeholder="#hex ou linear-gradient(...)"
          />
        </div>
      </div>
    </div>
  )
}
