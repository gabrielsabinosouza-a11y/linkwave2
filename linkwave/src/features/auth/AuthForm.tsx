'use client'

import { useState, useTransition, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Eye, EyeOff, Mail, Lock, Chrome, Github } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm() {
  const router = useRouter()
  const supabase = createClient()
  const [showPwd, setShowPwd] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const [magicSent, setMagicSent] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const email = (fd.get('email') as string).trim().toLowerCase()
    const password = fd.get('password') as string

    startTransition(async () => {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        toast.error('E-mail ou senha incorretos')
        return
      }
      router.push('/dashboard')
      router.refresh()
    })
  }

  async function handleMagicLink() {
    const email = emailRef.current?.value.trim().toLowerCase()
    if (!email) { toast.error('Digite seu e-mail primeiro'); return }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) { toast.error('Erro ao enviar magic link'); return }
    setMagicSent(true)
    toast.success('Magic link enviado! Verifique seu e-mail.')
  }

  async function handleOAuth(provider: 'google' | 'github') {
    setOauthLoading(provider)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) { toast.error('Erro ao conectar'); setOauthLoading(null) }
  }

  return (
    <motion.div
      className="glass-strong p-8 md:p-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <Image src="/imgs/icons/favicon.png" alt="LinkWave" width={72} height={72} className="mx-auto mb-4 float-logo" priority />
        <h1 className="font-black text-3xl text-ocean mb-1">Bem-vindo de volta</h1>
        <p className="text-muted-ocean text-sm">Entre na sua onda</p>
      </div>

      {/* OAuth */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {([{ p: 'google', Icon: Chrome, label: 'Google' }, { p: 'github', Icon: Github, label: 'GitHub' }] as const).map(({ p, Icon, label }) => (
          <button key={p} type="button" onClick={() => handleOAuth(p)} disabled={!!oauthLoading || isPending}
            className="flex items-center justify-center gap-2 py-3 rounded-full font-bold text-ocean text-sm bg-white/50 border-[1.5px] border-white/80 hover:bg-white/70 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
            {oauthLoading === p
              ? <span className="w-4 h-4 border-2 border-ocean/30 border-t-ocean rounded-full animate-spin" />
              : <Icon size={16} />}
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-white/30" />
        <span className="text-muted-ocean text-xs font-semibold">ou e-mail</span>
        <div className="flex-1 h-px bg-white/30" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="block text-ocean text-sm font-bold mb-1.5">E-mail</label>
          <div className="relative flex items-center">
            <Mail size={16} className="absolute left-4 text-ocean-light pointer-events-none" />
            <input
              ref={emailRef}
              id="email" name="email" type="email"
              placeholder="seu@email.com" autoComplete="email" required
              className="w-full rounded-full py-3.5 pl-10 pr-4 text-ocean font-medium text-sm bg-white/45 backdrop-blur-sm border-[1.5px] border-white/80 placeholder:text-ocean-light/50 placeholder:font-normal focus:outline-none focus:bg-white/65 focus:border-white focus:ring-2 focus:ring-white/40 transition-all duration-200"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-ocean text-sm font-bold mb-1.5">Senha</label>
          <div className="relative flex items-center">
            <Lock size={16} className="absolute left-4 text-ocean-light pointer-events-none" />
            <input
              id="password" name="password" type={showPwd ? 'text' : 'password'}
              placeholder="••••••••" autoComplete="current-password" required
              className="w-full rounded-full py-3.5 pl-10 pr-12 text-ocean font-medium text-sm bg-white/45 backdrop-blur-sm border-[1.5px] border-white/80 placeholder:text-ocean-light/50 placeholder:font-normal focus:outline-none focus:bg-white/65 focus:border-white focus:ring-2 focus:ring-white/40 transition-all duration-200"
            />
            <button type="button" onClick={() => setShowPwd(!showPwd)} aria-label={showPwd ? 'Ocultar' : 'Mostrar'}
              className="absolute right-4 text-ocean-light hover:text-ocean transition-colors">
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={isPending || !!oauthLoading}
          className="btn-cta w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
          {isPending
            ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Entrando...</>
            : 'Entrar'}
        </button>

        {!magicSent ? (
          <button type="button" onClick={handleMagicLink}
            className="w-full text-center text-sm text-ocean-light underline underline-offset-2 hover:text-ocean transition-colors">
            Entrar com Magic Link (sem senha)
          </button>
        ) : (
          <p className="text-center text-emerald-600 text-sm font-semibold">✓ Magic link enviado para seu e-mail</p>
        )}
      </form>

      <p className="text-center text-muted-ocean text-sm mt-6">
        Não tem conta?{' '}
        <Link href="/auth/register" className="font-bold text-ocean hover:text-emerald-600 transition-colors">
          Cadastre-se grátis →
        </Link>
      </p>
    </motion.div>
  )
}
