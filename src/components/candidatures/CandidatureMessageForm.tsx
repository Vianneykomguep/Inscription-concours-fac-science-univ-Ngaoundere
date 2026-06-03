'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Send } from 'lucide-react'

type CandidatureMessageFormProps = {
  candidatureId: string
  placeholder: string
}

export default function CandidatureMessageForm({
  candidatureId,
  placeholder = 'Ecrivez votre message...',
}: CandidatureMessageFormProps) {
  const router = useRouter()
  const [contenu, setContenu] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const trimmed = contenu.trim()
    if (trimmed.length < 2) {
      setError("Ecrivez un message avant de l'envoyer.")
      return
    }

    startTransition(async () => {
      try {
        const response = await fetch(`/api/candidatures/${candidatureId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contenu: trimmed }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || "Impossible d'envoyer le message.")
          return
        }

        setContenu('')
        router.refresh()
      } catch {
        setError("Impossible d'envoyer le message. Verifiez votre connexion puis reessayez.")
      }
    })
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-3">
      <textarea
        value={contenu}
        onChange={(event) => setContenu(event.target.value)}
        placeholder={placeholder}
        disabled={isPending}
        className="input-field min-h-[96px] resize-y"
      />

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <button type="submit" disabled={isPending} className="btn-primary inline-flex items-center gap-2">
          <Send className="h-4 w-4" />
        {isPending ? 'Envoi...' : 'Envoyer'}
        </button>
      </div>
    </form>
  )
}
