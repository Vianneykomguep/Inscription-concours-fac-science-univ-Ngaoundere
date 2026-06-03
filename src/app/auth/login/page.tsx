'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('reset') === 'success') {
      setSuccess('Votre mot de passe a été modifié. Vous pouvez maintenant vous connecter.')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error)
        return
      }
      router.push(data.redirectUrl)
    } catch {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-emerald-50/50 lg:grid lg:grid-cols-[0.95fr_1.05fr]">
      <div className="relative hidden overflow-hidden bg-emerald-950 lg:block">
        <Image src="/assets/logo-fac-sciences.webp" alt="Université de Ngaoundéré" fill priority className="object-cover opacity-55" sizes="50vw" />
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
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-200">Faculté des Sciences</p>
            <h1 className="mt-3 text-4xl font-bold">Université de Ngaoundéré</h1>
            <p className="mt-4 text-lg leading-8 text-emerald-50">
              Plateforme d&apos;inscription en ligne aux concours de la Faculté des Sciences.
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
          <h2 className="text-2xl font-bold text-slate-950">Connexion</h2>
          <p className="mt-2 text-slate-600">Accédez à votre espace candidat</p>

          {success && (
            <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {success}
            </div>
          )}
          {error && <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="label-field">Adresse email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field" placeholder="votre@email.com" />
            </div>
            <div>
              <label className="label-field">Mot de passe</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field pr-10" placeholder="********" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-xs font-semibold text-slate-500" aria-label="Afficher le mot de passe">
                  {showPassword ? 'Masquer' : 'Afficher'}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" className="rounded border-slate-300" /> Se souvenir de moi
              </label>
              <Link href="/auth/forgot-password" className="text-sm font-medium text-uni-green hover:underline">Mot de passe oublié </Link>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600">
            Pas encore de compte  <Link href="/auth/register" className="font-medium text-uni-green hover:underline">Créer un compte</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
