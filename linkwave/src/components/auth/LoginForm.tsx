'use client'

import { useActionState, useState, useTransition, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { Eye, EyeOff, AtSign, Lock, Chrome, Github, LogIn } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { loginAction, type LoginState } from '@/app/actions/login'

const initialState: LoginState = {}

export default function LoginForm() {
  const [state, action] = useActionState(loginAction, initialState)
  const [, startTransition] = useTransition()
  const [isPending, setIsPending] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<'google' | 'github' | null>(null)
  const [magicSent, setMagicSent] = useState(false)
  const loginRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  function handleFormAction(formData: FormData) {
    setIsPending(true)
    startTransition(async () => {
      await action(formData)
      setIsPending(false)
    })
  }

  async function handleOAuth(provider: 'google' | 'github') {
    setOauthLoading(provider)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    })
    if (error) {
      toast.error('Erro ao conectar com ' + provider)
      setOauthLoading(null)
    }
  }

  async function handleMagicLink() {
    const loginValue = loginRef.current?.value.trim()
    if (!loginValue) { toast.error('Digite seu e-mail ou username'); return }

    // Magic link requires an email — if username, show hint
    if (!loginValue.includes('@')) {
      toast.error('Para o Magic Link, use seu e-mail')
      return
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: loginValue.toLowerCase(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    if (error) { toast.error('Erro ao enviar magic link'); return }
    setMagicSent(true)
    toast.success('Magic link enviado! Verifique seu e-mail.')
  }

  const isLoading = isPending || !!oauthLoading

  return (
    <motion.div
      className="glass-strong p-8 md:p-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <Image
          src="/imgs/icons/favicon.png"
          alt="LinkWave"
          width={80}
          height={80}
          className="mx-auto mb-4 float-logo"
          priority
        />
        <h1 className="font-black text-3xl text-ocean mb-1">Bem-vindo de volta</h1>
        <p className="text-muted-ocean text-sm">Faça login para continuar surfando</p>
      </div>

      {/* OAuth buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {([
          { provider: 'google', Icon: Chrome, label: 'Google' },
          { provider: 'github', Icon: Github, label: 'GitHub' },
        ] as const).map(({ provider, Icon, label }) => (
          <button
            key={provider}
            type="button"
            onClick={() => handleOAuth(provider)}
            disabled={isLoading}
            aria-label={`Continuar com ${label}`}
            className="flex items-center justify-center gap-2 py-3 rounded-full font-bold text-ocean text-sm
              bg-white/50 border-[1.5px] border-white/80
              hover:bg-white/70 hover:-translate-y-0.5
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200"
          >
            {oauthLoading === provider ? (
              <span className="w-4 h-4 border-2 border-ocean/30 border-t-ocean rounded-full animate-spin" />
            ) : (
              <Icon size={16} />
            )}
            {label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6" role="separator">
        <div className="flex-1 h-px bg-white/30" />
        <span className="text-muted-ocean text-xs font-semibold">ou e-mail / username</span>
        <div className="flex-1 h-px bg-white/30" />
      </div>

      {/* Root error */}
      <AnimatePresence>
        {state.errors?.root && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 p-3 rounded-2xl bg-red-100/70 border border-red-200/80 text-red-600 text-sm font-medium flex items-center gap-2"
            role="alert"
          >
            <span className="shrink-0">⚠️</span>
            {state.errors.root[0]}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form action={handleFormAction} noValidate className="space-y-4">
        {/* Login field */}
        <div>
          <label htmlFor="login" className="block text-ocean text-sm font-bold mb-1.5">
            E-mail ou username
          </label>
          <div className="relative flex items-center">
            <AtSign size={16} className="absolute left-4 text-ocean-light pointer-events-none" />
            <input
              ref={loginRef}
              id="login"
              name="login"
              type="text"
              placeholder="seu@email.com ou @seunome"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              required
              className="w-full rounded-full py-3.5 pl-10 pr-4 text-ocean font-medium text-sm
                bg-white/45 backdrop-blur-sm border-[1.5px] border-white/80
                placeholder:text-ocean-light/50 placeholder:font-normal
                focus:outline-none focus:bg-white/65 focus:border-white focus:ring-2 focus:ring-white/40
                transition-all duration-200"
            />
          </div>
          <AnimatePresence>
            {state.errors?.login && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-red-500 text-xs mt-1.5 font-medium" role="alert">
                {state.errors.login[0]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Password field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="text-ocean text-sm font-bold">
              Senha
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-ocean-light hover:text-ocean underline underline-offset-2 transition-colors"
            >
              Esqueci a senha
            </Link>
          </div>
          <div className="relative flex items-center">
            <Lock size={16} className="absolute left-4 text-ocean-light pointer-events-none" />
            <input
              id="password"
              name="password"
              type={showPwd ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="w-full rounded-full py-3.5 pl-10 pr-12 text-ocean font-medium text-sm
                bg-white/45 backdrop-blur-sm border-[1.5px] border-white/80
                placeholder:text-ocean-light/50 placeholder:font-normal
                focus:outline-none focus:bg-white/65 focus:border-white focus:ring-2 focus:ring-white/40
                transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              aria-label={showPwd ? 'Ocultar senha' : 'Mostrar senha'}
              className="absolute right-4 text-ocean-light hover:text-ocean transition-colors"
            >
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <AnimatePresence>
            {state.errors?.password && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-red-500 text-xs mt-1.5 font-medium" role="alert">
                {state.errors.password[0]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2.5">
          <input
            type="checkbox"
            id="remember"
            name="remember"
            className="w-4 h-4 accent-emerald-500 cursor-pointer rounded"
          />
          <label htmlFor="remember" className="text-ocean text-sm cursor-pointer select-none">
            Lembrar de mim
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isPending}
          className="btn-cta w-full justify-center mt-2
            disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isPending ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Entrando...
            </>
          ) : (
            <>
              <LogIn size={18} />
              Entrar
            </>
          )}
        </button>

        {/* Magic link */}
        <div className="text-center">
          {!magicSent ? (
            <button
              type="button"
              onClick={handleMagicLink}
              disabled={isLoading}
              className="text-sm text-ocean-light underline underline-offset-2 hover:text-ocean transition-colors disabled:opacity-50"
            >
              Entrar com Magic Link (sem senha)
            </button>
          ) : (
            <motion.p
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-emerald-600 text-sm font-semibold"
            >
              ✓ Magic link enviado — verifique seu e-mail
            </motion.p>
          )}
        </div>
      </form>

      {/* Register link */}
      <p className="text-center text-muted-ocean text-sm mt-6">
        Ainda não tem conta?{' '}
        <Link
          href="/auth/register"
          className="font-bold text-ocean hover:text-emerald-600 transition-colors"
        >
          Criar conta grátis →
        </Link>
      </p>
    </motion.div>
  )
}
