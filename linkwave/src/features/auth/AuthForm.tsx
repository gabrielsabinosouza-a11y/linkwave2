'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Eye, EyeOff, Github, Mail, Chrome } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '@/lib/validations'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'

type Mode = 'login' | 'register'

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter()
  const supabase = createClient()
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const schema = mode === 'login' ? loginSchema : registerSchema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput & RegisterInput>({ resolver: zodResolver(schema) })

  async function onSubmit(values: LoginInput & RegisterInput) {
    setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        })
        if (error) throw error
        router.push('/dashboard')
        router.refresh()
      } else {
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: { username: values.username },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        toast.success('Confirme seu email para continuar!')
      }
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Ocorreu um erro')
    } finally {
      setLoading(false)
    }
  }

  async function signInWithProvider(provider: 'google' | 'github' | 'discord') {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  async function signInWithMagicLink(email: string) {
    if (!email) return toast.error('Digite seu email')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) toast.error(error.message)
    else toast.success('Magic link enviado! Verifique seu email.')
  }

  return (
    <motion.div
      className="glass-strong p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col items-center mb-8">
        <Image src="/imgs/icons/favicon.png" alt="LinkWave" width={56} height={56} className="mb-3 float-logo" />
        <h1 className="font-black text-2xl text-ocean">
          {mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
        </h1>
        <p className="text-muted-ocean text-sm mt-1">
          {mode === 'login' ? 'Entre na sua onda' : 'Comece gratuitamente'}
        </p>
      </div>

      {/* Social providers */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {([
          { provider: 'google', Icon: Chrome, label: 'Google' },
          { provider: 'github', Icon: Github, label: 'GitHub' },
          { provider: 'discord', Icon: Mail, label: 'Discord' },
        ] as const).map(({ provider, Icon, label }) => (
          <button
            key={provider}
            onClick={() => signInWithProvider(provider)}
            className="flex flex-col items-center gap-1 py-3 rounded-2xl font-semibold text-ocean text-xs transition-all hover:scale-105 hover:-translate-y-0.5"
            style={{
              background: 'rgba(255,255,255,0.6)',
              border: '1.5px solid rgba(255,255,255,0.9)',
              boxShadow: '0 2px 8px rgba(80,180,220,0.15)',
            }}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px" style={{ background: 'rgba(80,120,160,0.2)' }} />
        <span className="text-muted-ocean text-xs font-semibold">ou email</span>
        <div className="flex-1 h-px" style={{ background: 'rgba(80,120,160,0.2)' }} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {mode === 'register' && (
          <div>
            <Label className="text-ocean font-semibold text-sm">Username</Label>
            <Input
              {...register('username')}
              placeholder="seu_username"
              className="mt-1 bg-white/50 border-white/70 focus:border-sky-400"
            />
            <AnimatePresence>
              {errors.username && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mt-1">
                  {errors.username.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        )}

        <div>
          <Label className="text-ocean font-semibold text-sm">Email</Label>
          <Input
            {...register('email')}
            type="email"
            placeholder="voce@email.com"
            className="mt-1 bg-white/50 border-white/70 focus:border-sky-400"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <Label className="text-ocean font-semibold text-sm">Senha</Label>
          <div className="relative mt-1">
            <Input
              {...register('password')}
              type={showPwd ? 'text' : 'password'}
              placeholder="••••••••"
              className="bg-white/50 border-white/70 focus:border-sky-400 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-ocean"
            >
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Carregando...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
        </button>

        {mode === 'login' && (
          <button
            type="button"
            onClick={() => {
              const emailEl = document.querySelector<HTMLInputElement>('input[type=email]')
              signInWithMagicLink(emailEl?.value ?? '')
            }}
            className="w-full text-center text-sm text-ocean-light underline underline-offset-2 hover:text-ocean transition-colors"
          >
            Entrar com Magic Link
          </button>
        )}
      </form>

      <p className="text-center text-muted-ocean text-sm mt-6">
        {mode === 'login' ? (
          <>Não tem conta? <Link href="/auth/register" className="text-ocean font-bold hover:underline">Cadastre-se</Link></>
        ) : (
          <>Já tem conta? <Link href="/auth/login" className="text-ocean font-bold hover:underline">Entrar</Link></>
        )}
      </p>
    </motion.div>
  )
}
