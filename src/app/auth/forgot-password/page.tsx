'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'reset'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const requestCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Impossible d'envoyer le code")
        return
      }

      setMessage(data.message || 'Si un compte existe avec cet email, un code sera envoyé.')
      setStep('reset')
    } catch {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, password }),
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Impossible de modifier le mot de passe')
        return
      }

      router.push('/auth/login?reset=success')
    } catch {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-emerald-50/50 lg:grid lg:grid-cols-[0.95fr_1.05fr]">
      <div className="relative hidden overflow-hidden bg-emerald-950 lg:block">
        <Image src="/assets/logo-fac-sciences.webp" alt="Faculté des Sciences" fill priority className="object-cover opacity-55" sizes="50vw" />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-950/80 to-emerald-800/40" />
        <div className="relative flex min-h-screen flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-white p-2">
              <Image src="/assets/logo-univ-ngaoundere.webp" alt="Logo Université de Ngaoundéré" width={44} height={44} />
            </span>
            <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-white p-2">
              <Image src="/assets/logo-fac-sciences.webp" alt="Logo Faculté des Sciences" width={44} height={44} />
            </span>
          </Link>
          <div className="max-w-md">
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-200">Sécurité du compte</p>
            <h1 className="mt-3 text-4xl font-bold">Réinitialisez votre accès</h1>
            <p className="mt-4 text-lg leading-8 text-emerald-50">
              Recevez un code par email, puis choisissez un nouveau mot de passe.
            </p>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md rounded-lg border border-emerald-900/10 bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <Image src="/assets/logo-univ-ngaoundere.webp" alt="Logo Université de Ngaoundéré" width={44} height={44} />
            <Image src="/assets/logo-fac-sciences.webp" alt="Logo Faculté des Sciences" width={44} height={44} />
          </div>

          <h2 className="text-2xl font-bold text-slate-950">Mot de passe oublié</h2>
          <p className="mt-2 text-slate-600">
            {step === 'email' ? 'Entrez votre email pour recevoir un code.' : 'Entrez le code reçu et votre nouveau mot de passe.'}
          </p>

          {error && <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          {message && <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{message}</div>}

          {step === 'email' ? (
            <form onSubmit={requestCode} className="mt-8 space-y-5">
              <div>
                <label className="label-field">Adresse email</label>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="input-field" placeholder="votre@email.com" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Envoi...' : 'Recevoir le code'}
              </button>
            </form>
          ) : (
            <form onSubmit={resetPassword} className="mt-8 space-y-5">
              <div>
                <label className="label-field">Adresse email</label>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="input-field" />
              </div>
              <div>
                <label className="label-field">Code reçu</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  className="input-field text-center font-mono text-xl tracking-[0.35em]"
                  placeholder="000000"
                />
              </div>
              <div>
                <label className="label-field">Nouveau mot de passe</label>
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required className="input-field" placeholder="Min. 8 caractères" />
              </div>
              <div>
                <label className="label-field">Confirmer le mot de passe</label>
                <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required className="input-field" placeholder="********" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Modification...' : 'Modifier le mot de passe'}
              </button>
              <button type="button" onClick={() => setStep('email')} className="w-full text-sm font-semibold text-uni-green hover:underline">
                Renvoyer un code
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-slate-600">
            Vous vous souvenez du mot de passe  <Link href="/auth/login" className="font-medium text-uni-green hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
