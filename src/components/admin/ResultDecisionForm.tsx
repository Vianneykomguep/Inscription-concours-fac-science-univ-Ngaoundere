'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

export default function ResultDecisionForm({ candidatureId }: { candidatureId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const [form, setForm] = useState({ statutFinal: 'ADMISSIBLE', note: '', rang: '' })

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)

    startTransition(async () => {
      const response = await fetch('/api/admin/resultats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidatureId, ...form }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        setMessage(data?.error ?? 'Publication impossible')
        return
      }

      router.refresh()
    })
  }

  return (
    <form onSubmit={submit} className="grid gap-2 md:grid-cols-[1fr_88px_80px_auto]">
      <select
        className="input-field"
        value={form.statutFinal}
        onChange={(event) => setForm((current) => ({ ...current, statutFinal: event.target.value }))}
      >
        <option value="ADMISSIBLE">Admissible</option>
        <option value="ADMIS">Admis</option>
        <option value="NON_ADMIS">Non admis</option>
      </select>
      <input
        className="input-field"
        type="number"
        step="0.01"
        placeholder="Note"
        value={form.note}
        onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
      />
      <input
        className="input-field"
        type="number"
        placeholder="Rang"
        value={form.rang}
        onChange={(event) => setForm((current) => ({ ...current, rang: event.target.value }))}
      />
      <button className="btn-primary" disabled={isPending} type="submit">
        Publier
      </button>
      {message && <p className="text-xs text-red-600 md:col-span-4">{message}</p>}
    </form>
  )
}
