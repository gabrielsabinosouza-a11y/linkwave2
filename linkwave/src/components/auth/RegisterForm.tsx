'use client'

import { useActionState, useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, EyeOff, User, Mail, AtSign, Lock, CheckCircle2, Chrome, Github } from 'lucide-react'
import { registerAction, type RegisterState } from '@/app/actions/register'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const initialState: RegisterState = {}

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null
  return (
    <AnimatePresence>
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="text-red-500 text-xs mt-1.5 font-medium"
        role="alert"
      >
        {messages[0]}
      </motion.p>
    </AnimatePresence>
  )
}

function FormInput({
  id,
  name,
  type = 'text',
  placeholder,
  autoComplete,
  icon: Icon,
  prefix,
  children,
}: {
  id: string
  name: string
  type?: string
  placeholder: string
  autoComplete?: string
  icon: React.ElementType
  prefix?: string
  children?: React.ReactNode
}) {
  return (
    <div className="relative flex items-center">
      <Icon
        size={16}
        className="absolute left-4 text-ocean-light pointer-events-none z-10"
        aria-hidden="true"
      />
      {prefix && (
        <span className="absolute left-10 text-ocean-light font-bold text-sm pointer-events-none z-10">
          {prefix}
        </span>
      )}
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className={`w-full rounded-full py-3.5 pr-4 text-ocean font-medium text-sm
          bg-white/45 backdrop-blur-sm border-[1.5px] border-white/80
          placeholder:text-ocean-light/50 placeholder:font-normal
          focus:outline-none focus:bg-white/65 focus:border-white focus:ring-2 focus:ring-white/40
          transition-all duration-200
          ${prefix ? 'pl-14' : 'pl-10'}`}
      />
      {children}
    </div>
  )
}

export default function RegisterForm() {
  const [state, action] = useActionState(registerAction, initialState)
  const [isPending, startTransition] = useTransition()
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const supabase = createClient()

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

  // Email confirmation pending state
  if (state.message === 'confirm-email') {
    return (
      <motion.div
        className="glass-strong p-10 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} className="text-emerald-500" />
        </div>
        <h2 className="font-black text-2xl text-ocean mb-2">Confirme seu e-mail!</h2>
        <p className="text-muted-ocean text-sm leading-relaxed">
          Enviamos um link de confirmação para o seu e-mail.
          <br />
          Verifique sua caixa de entrada (e a pasta de spam).
        </p>
        <Link
          href="/auth/login"
          className="inline-block mt-6 text-ocean font-bold text-sm hover:underline"
        >
          Já confirmei → Fazer login
        </Link>
      </motion.div>
    )
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
        <Image
          src="/imgs/icons/favicon.png"
          alt="LinkWave"
          width={80}
          height={80}
          className="mx-auto mb-4 float-logo"
          priority
        />
        <h1 className="font-black text-3xl text-ocean mb-1">Criar conta</h1>
        <p className="text-muted-ocean text-sm">Comece a surfar na sua onda de links</p>
      </div>

      {/* OAuth buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => handleOAuth('google')}
          disabled={!!oauthLoading || isPending}
          aria-label="Continuar com Google"
          className="flex items-center justify-center gap-2 py-3 rounded-full font-bold text-ocean text-sm
            bg-white/50 border-[1.5px] border-white/80
            hover:bg-white/70 hover:-translate-y-0.5
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200 shadow-sm"
        >
          {oauthLoading === 'google' ? (
            <span className="w-4 h-4 border-2 border-ocean/30 border-t-ocean rounded-full animate-spin" />
          ) : (
            <Chrome size={16} />
          )}
          Google
        </button>
        <button
          type="button"
          onClick={() => handleOAuth('github')}
          disabled={!!oauthLoading || isPending}
          aria-label="Continuar com GitHub"
          className="flex items-center justify-center gap-2 py-3 rounded-full font-bold text-ocean text-sm
            bg-white/50 border-[1.5px] border-white/80
            hover:bg-white/70 hover:-translate-y-0.5
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200 shadow-sm"
        >
          {oauthLoading === 'github' ? (
            <span className="w-4 h-4 border-2 border-ocean/30 border-t-ocean rounded-full animate-spin" />
          ) : (
            <Github size={16} />
          )}
          GitHub
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6" role="separator">
        <div className="flex-1 h-px bg-white/30" />
        <span className="text-muted-ocean text-xs font-semibold">ou cadastre com e-mail</span>
        <div className="flex-1 h-px bg-white/30" />
      </div>

      {/* Root error */}
      {state.errors?.root && (
        <div
          className="mb-4 p-3 rounded-2xl bg-red-100/70 border border-red-200 text-red-600 text-sm font-medium"
          role="alert"
        >
          {state.errors.root[0]}
        </div>
      )}

      {/* Form */}
      <form
        action={(fd) => startTransition(() => action(fd))}
        noValidate
        className="space-y-4"
      >
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-ocean text-sm font-bold mb-1.5">
            Nome completo
          </label>
          <FormInput
            id="name"
            name="name"
            placeholder="Seu nome completo"
            autoComplete="name"
            icon={User}
          />
          <FieldError messages={state.errors?.name} />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-ocean text-sm font-bold mb-1.5">
            E-mail
          </label>
          <FormInput
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            icon={Mail}
          />
          <FieldError messages={state.errors?.email} />
        </div>

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-ocean text-sm font-bold mb-1.5">
            Username
          </label>
          <FormInput
            id="username"
            name="username"
            placeholder="seunome"
            autoComplete="username"
            icon={AtSign}
            prefix="@"
          />
          <p className="text-muted-ocean text-xs mt-1">
            Seu link público: <span className="font-bold">linkwave.app/seunome</span>
          </p>
          <FieldError messages={state.errors?.username} />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-ocean text-sm font-bold mb-1.5">
            Senha
          </label>
          <div className="relative">
            <FormInput
              id="password"
              name="password"
              type={showPwd ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="new-password"
              icon={Lock}
            >
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                aria-label={showPwd ? 'Ocultar senha' : 'Mostrar senha'}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ocean-light hover:text-ocean transition-colors"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </FormInput>
          </div>
          <p className="text-muted-ocean text-xs mt-1">Mín. 8 caracteres, 1 maiúscula e 1 número</p>
          <FieldError messages={state.errors?.password} />
        </div>

        {/* Confirm password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-ocean text-sm font-bold mb-1.5">
            Confirmar senha
          </label>
          <div className="relative">
            <FormInput
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="new-password"
              icon={Lock}
            >
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? 'Ocultar confirmação' : 'Mostrar confirmação'}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ocean-light hover:text-ocean transition-colors"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </FormInput>
          </div>
          <FieldError messages={state.errors?.confirmPassword} />
        </div>

        {/* Terms */}
        <div className="flex items-start gap-3 pt-1">
          <input
            type="checkbox"
            id="terms"
            name="terms"
            required
            className="mt-0.5 w-4 h-4 accent-emerald-500 cursor-pointer"
          />
          <label htmlFor="terms" className="text-ocean text-sm leading-snug cursor-pointer">
            Li e aceito os{' '}
            <Link
              href="/terms"
              target="_blank"
              className="font-bold underline underline-offset-2 hover:text-emerald-600 transition-colors"
            >
              Termos de Uso
            </Link>
          </label>
        </div>
        <FieldError messages={state.errors?.terms} />

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending || !!oauthLoading}
          aria-busy={isPending}
          className="btn-cta w-full justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isPending ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Criando conta...
            </>
          ) : (
            <>
              <User size={18} />
              Criar minha conta
            </>
          )}
        </button>
      </form>

      {/* Login link */}
      <p className="text-center text-muted-ocean text-sm mt-6">
        Já tem uma conta?{' '}
        <Link
          href="/auth/login"
          className="font-bold text-ocean hover:text-emerald-600 transition-colors"
        >
          Fazer login →
        </Link>
      </p>
    </motion.div>
  )
}
