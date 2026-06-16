'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function ForgotPasswordForm() {
  const [sent, setSent] = useState(false)
  const [isPending, startTransition] = useTransition()
  const supabase = createClient()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const email = (fd.get('email') as string).trim().toLowerCase()

    startTransition(async () => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      // Always show success to prevent email enumeration
      if (error) console.error(error)
      setSent(true)
      toast.success('Se este e-mail existir, você receberá um link em breve.')
    })
  }

  return (
    <motion.div
      className="glass-strong p-8 md:p-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-8">
        <Image src="/imgs/icons/favicon.png" alt="LinkWave" width={72} height={72} className="mx-auto mb-4 float-logo" priority />
        <h1 className="font-black text-3xl text-ocean mb-1">Recuperar senha</h1>
        <p className="text-muted-ocean text-sm">Enviaremos um link para redefinir sua senha</p>
      </div>

      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <p className="text-ocean font-bold mb-1">E-mail enviado!</p>
            <p className="text-muted-ocean text-sm">
              Verifique sua caixa de entrada e pasta de spam.
            </p>
            <Link href="/auth/login" className="inline-block mt-6 text-ocean font-bold text-sm hover:underline">
              ← Voltar para o login
            </Link>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="space-y-4"
            noValidate
          >
            <div>
              <label htmlFor="email" className="block text-ocean text-sm font-bold mb-1.5">
                Seu e-mail
              </label>
              <div className="relative flex items-center">
                <Mail size={16} className="absolute left-4 text-ocean-light pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-full py-3.5 pl-10 pr-4 text-ocean font-medium text-sm
                    bg-white/45 backdrop-blur-sm border-[1.5px] border-white/80
                    placeholder:text-ocean-light/50 placeholder:font-normal
                    focus:outline-none focus:bg-white/65 focus:border-white focus:ring-2 focus:ring-white/40
                    transition-all duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn-cta w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Mail size={18} />
                  Enviar link de recuperação
                </>
              )}
            </button>

            <Link
              href="/auth/login"
              className="flex items-center justify-center gap-1.5 text-sm text-ocean-light hover:text-ocean transition-colors"
            >
              <ArrowLeft size={14} /> Voltar para o login
            </Link>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
