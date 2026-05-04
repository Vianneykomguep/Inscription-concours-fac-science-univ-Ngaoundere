'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap, Mail, Lock, User, Phone, Loader2, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) { setError('Les mots de passe ne correspondent pas'); return }
    if (form.password.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password, firstName: form.firstName, lastName: form.lastName, phone: form.phone || undefined }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      router.push('/auth/verify-email')
    } catch { setError('Erreur de connexion') }
    finally { setLoading(false) }
  }

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [field]: e.target.value }))

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-uni-green via-green-800 to-green-900 items-center justify-center p-12">
        <div className="text-center text-white max-w-md">
          <GraduationCap className="mx-auto h-16 w-16 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Rejoignez-nous</h1>
          <p className="text-green-200">Créez votre compte pour vous inscrire aux concours de la Faculté des Sciences</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Créer un compte</h2>
          <p className="text-gray-600 mb-8">Remplissez le formulaire ci-dessous</p>
          {error && <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-field">Prénom</label>
                <div className="relative"><User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input type="text" value={form.firstName} onChange={update('firstName')} required className="input-field pl-10" placeholder="Jean" /></div>
              </div>
              <div>
                <label className="label-field">Nom</label>
                <input type="text" value={form.lastName} onChange={update('lastName')} required className="input-field" placeholder="Dupont" />
              </div>
            </div>
            <div>
              <label className="label-field">Email</label>
              <div className="relative"><Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input type="email" value={form.email} onChange={update('email')} required className="input-field pl-10" placeholder="votre@email.com" /></div>
            </div>
            <div>
              <label className="label-field">Téléphone (optionnel)</label>
              <div className="relative"><Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input type="tel" value={form.phone} onChange={update('phone')} className="input-field pl-10" placeholder="+237 6XX XXX XXX" /></div>
            </div>
            <div>
              <label className="label-field">Mot de passe</label>
              <div className="relative"><Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={update('password')} required className="input-field pl-10 pr-10" placeholder="Min. 8 caractères" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
            </div>
            <div>
              <label className="label-field">Confirmer le mot de passe</label>
              <input type="password" value={form.confirmPassword} onChange={update('confirmPassword')} required className="input-field" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Créer mon compte'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Déjà un compte ? <Link href="/auth/login" className="text-primary-600 font-medium hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
