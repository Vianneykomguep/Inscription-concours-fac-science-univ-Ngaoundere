'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    if (form.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password, firstName: form.firstName, lastName: form.lastName, phone: form.phone || undefined }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error)
        return
      }
      if (data.warning) {
        sessionStorage.setItem('verify-email-warning', data.warning)
      }
      router.push('/auth/verify-email')
    } catch {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((value) => ({ ...value, [field]: e.target.value }))

  return (
    <div className="min-h-screen bg-emerald-50/50 lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md rounded-lg border border-emerald-900/10 bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-7 flex items-center gap-3">
            <Image src="/assets/logo-univ-ngaoundere.webp" alt="Logo Université de Ngaoundéré" width={42} height={42} />
            <Image src="/assets/logo-fac-sciences.webp" alt="Logo Faculté des Sciences" width={42} height={42} />
          </div>
          <h2 className="text-2xl font-bold text-slate-950">Créer un compte</h2>
          <p className="mt-2 text-slate-600">Remplissez le formulaire ci-dessous</p>
          {error && <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label-field">Prénom</label>
                <input type="text" value={form.firstName} onChange={update('firstName')} required className="input-field" placeholder="Jean" />
              </div>
              <div>
                <label className="label-field">Nom</label>
                <input type="text" value={form.lastName} onChange={update('lastName')} required className="input-field" placeholder="Dupont" />
              </div>
            </div>
            <div>
              <label className="label-field">Email</label>
              <input type="email" value={form.email} onChange={update('email')} required className="input-field" placeholder="votre@email.com" />
            </div>
            <div>
              <label className="label-field">Téléphone (optionnel)</label>
              <input type="tel" value={form.phone} onChange={update('phone')} className="input-field" placeholder="+237 6XX XXX XXX" />
            </div>
            <div>
              <label className="label-field">Mot de passe</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={update('password')} required className="input-field pr-10" placeholder="Min. 8 caractères" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-xs font-semibold text-slate-500" aria-label="Afficher le mot de passe">
                  {showPassword ? 'Masquer' : 'Afficher'}
                </button>
              </div>
            </div>
            <div>
              <label className="label-field">Confirmer le mot de passe</label>
              <input type="password" value={form.confirmPassword} onChange={update('confirmPassword')} required className="input-field" placeholder="********" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600">
            Déjà un compte  <Link href="/auth/login" className="font-medium text-uni-green hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-emerald-950 lg:block">
        <Image src="/assets/register-campus.jpeg" alt="Faculté des Sciences" fill priority className="object-cover opacity-55" sizes="50vw" />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-950/75 to-amber-700/30" />
        <div className="relative flex min-h-screen flex-col justify-end p-12 text-white">
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-200">Concours en ligne</p>
          <h1 className="mt-3 text-4xl font-bold">Rejoignez la Faculté des Sciences</h1>
          <p className="mt-4 max-w-md text-lg leading-8 text-emerald-50">
            Créez votre compte, choisissez un concours et suivez chaque étape de votre candidature.
          </p>
        </div>
      </div>
    </div>
  )
}
