'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GraduationCap, Loader2, Mail } from 'lucide-react'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      router.push('/dashboard')
    } catch { setError('Erreur de vérification') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md card text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
          <Mail className="h-8 w-8 text-uni-green" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Vérifiez votre email</h2>
        <p className="text-gray-600 mb-8">Entrez le code à 6 chiffres envoyé à votre adresse email</p>
        {error && <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={otp} onChange={e => setOtp(e.target.value)} required maxLength={6}
            className="input-field text-center text-2xl tracking-[0.5em] font-mono" placeholder="000000" />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Vérifier'}
          </button>
        </form>
      </div>
    </div>
  )
}
