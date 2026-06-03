'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Mail } from 'lucide-react'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    const warning = sessionStorage.getItem('verify-email-warning')
    if (warning) {
      setError(warning)
      sessionStorage.removeItem('verify-email-warning')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error)
        return
      }
      router.push('/dashboard')
    } catch {
      setError('Erreur de vérification')
    } finally {
      setLoading(false)
    }
  }

  const resendCode = async () => {
    setError('')
    setMessage('')
    setResending(true)
    try {
      const res = await fetch('/api/auth/resend-verification', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Impossible de renvoyer le code')
        return
      }
      setMessage('Un nouveau code vient d’être envoyé à votre adresse email.')
    } catch {
      setError('Erreur de connexion')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="card w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Mail className="h-8 w-8 text-uni-green" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Vérifiez votre email</h2>
        <p className="mb-8 text-gray-600">Entrez le code à 6 chiffres envoyé à votre adresse email</p>
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {message && <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            required
            maxLength={6}
            className="input-field text-center font-mono text-2xl tracking-[0.5em]"
            placeholder="000000"
          />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Vérifier'}
          </button>
        </form>
        <button
          type="button"
          onClick={resendCode}
          disabled={resending}
          className="mt-4 text-sm font-semibold text-uni-green hover:underline disabled:opacity-60"
        >
          {resending ? 'Renvoi en cours...' : 'Renvoyer le code'}
        </button>
      </div>
    </div>
  )
}
