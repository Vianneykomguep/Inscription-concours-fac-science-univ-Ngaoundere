'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Upload } from 'lucide-react'

type ComplementResponseFormProps = {
  candidatureId: string
}

export default function ComplementResponseForm({ candidatureId }: ComplementResponseFormProps) {
  const router = useRouter()
  const [response, setResponse] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (response.trim().length < 5) {
      setError('Ajoutez une réponse de quelques mots pour expliquer le complément fourni.')
      return
    }

    const formData = new FormData()
    formData.append('reponse', response.trim())

    files.forEach((file) => {
      formData.append('file:complement', file)
    })

    startTransition(async () => {
      try {
        const result = await fetch(`/api/candidatures/${candidatureId}/complement`, {
          method: 'POST',
          body: formData,
        })

        const data = await result.json()

        if (!result.ok) {
          setError(data?.error || "Impossible d'envoyer le complément.")
          return
        }

        router.push(`/candidatures/${candidatureId}`)
        router.refresh()
      } catch {
        setError("Impossible d'envoyer le complément. Vérifiez votre connexion puis réessayez.")
      }
    })
  }

  return (
    <form onSubmit={submit} className="card space-y-5">
      <div>
        <label htmlFor="response" className="label-field">
          Réponse au complément demandé
        </label>
        <textarea
          id="response"
          className="input-field min-h-[140px]"
          value={response}
          onChange={(event) => setResponse(event.target.value)}
          placeholder="Expliquez brièvement les pièces ou informations ajoutées..."
          disabled={isPending}
        />
      </div>

      <div>
        <label htmlFor="files" className="label-field">
          Fichiers complémentaires
        </label>
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center transition hover:bg-gray-100">
          <Upload className="mb-2 h-6 w-6 text-gray-400" />
          <span className="text-sm font-medium text-gray-800">Ajouter des fichiers</span>
          <span className="mt-1 text-xs text-gray-500">PDF, JPG ou PNG</span>
          <input
            id="files"
            type="file"
            multiple
            accept=".pdf,image/jpeg,image/png"
            className="sr-only"
            disabled={isPending}
            onChange={(event) => setFiles(Array.from(event.target.files || []))}
          />
        </label>

        {files.length > 0 && (
          <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3">
            <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Fichiers sélectionnés</p>
            <ul className="space-y-1 text-sm text-gray-700">
              {files.map((file) => (
                <li key={`${file.name}-${file.size}`} className="flex justify-between gap-3">
                  <span className="truncate">{file.name}</span>
                  <span className="shrink-0 text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} Mo</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending ? 'Envoi en cours...' : 'Envoyer le complément'}
        </button>
      </div>
    </form>
  )
}
