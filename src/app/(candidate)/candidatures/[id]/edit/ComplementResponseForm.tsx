'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { FileText, Upload } from 'lucide-react'

type ExistingDocument = {
  id: string
  label: string
  detail: string
  href: string
  source: 'uploaded' | 'document'
}

type ComplementResponseFormProps = {
  candidatureId: string
  existingDocuments: ExistingDocument[]
}

export default function ComplementResponseForm({ candidatureId, existingDocuments }: ComplementResponseFormProps) {
  const router = useRouter()
  const [response, setResponse] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [replacementFiles, setReplacementFiles] = useState<Record<string, File>>({})
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (response.trim().length < 5) {
      setError('Ajoutez une reponse de quelques mots pour expliquer le complement fourni.')
      return
    }

    const formData = new FormData()
    formData.append('reponse', response.trim())

    files.forEach((file, index) => {
      formData.append(`file:complement_${index + 1}`, file)
    })

    Object.entries(replacementFiles).forEach(([key, file]) => {
      formData.append(`replace:${key}`, file)
    })

    startTransition(async () => {
      try {
        const result = await fetch(`/api/candidatures/${candidatureId}/complement`, {
          method: 'POST',
          body: formData,
        })

        const data = await result.json()

        if (!result.ok) {
          setError(data.error || "Impossible d'envoyer le complement.")
          return
        }

        setFiles([])
        setReplacementFiles({})
        router.push(`/candidatures/${candidatureId}`)
        router.refresh()
      } catch {
        setError("Impossible d'envoyer le complement. Verifiez votre connexion puis reessayez.")
      }
    })
  }

  return (
    <form onSubmit={submit} className="card space-y-5">
      <div>
        <label htmlFor="response" className="label-field">
          Reponse au complement demande
        </label>
        <textarea
          id="response"
          className="input-field min-h-[140px]"
          value={response}
          onChange={(event) => setResponse(event.target.value)}
          placeholder="Expliquez brievement les pieces ou informations ajoutees..."
          disabled={isPending}
        />
      </div>

      {existingDocuments.length > 0 && (
        <div>
          <p className="label-field">Modifier les fichiers deja envoyes</p>
          <div className="space-y-3">
            {existingDocuments.map((document) => {
              const replacementKey = `${document.source}:${document.id}`
              const replacement = replacementFiles[replacementKey]

              return (
                <div key={replacementKey} className="rounded-lg border border-gray-200 bg-white p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 gap-3">
<div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">{document.label}</p>
                        <p className="text-xs text-gray-500">{document.detail}</p>
                        {replacement && (
                          <p className="mt-1 text-xs font-medium text-emerald-700">
                            Nouveau fichier selectionne : {replacement.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <a
                      href={document.href}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 text-sm font-medium text-primary-600 hover:underline"
                    >
                      Voir
                    </a>
                  </div>
                  <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Remplacer ce fichier
                    <input
                      type="file"
                      accept=".pdf,image/jpeg,image/png"
                      className="sr-only"
                      disabled={isPending}
                      onChange={(event) => {
                    const file = event.target.files?.[0]
                        setReplacementFiles((current) => {
                          const next = { ...current }
                          if (file) next[replacementKey] = file
                          else delete next[replacementKey]
                          return next
                        })
                      }}
                    />
                  </label>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div>
        <label htmlFor="files" className="label-field">
          Ajouter d'autres fichiers
        </label>
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center transition hover:bg-gray-100">
<Upload className="mb-2 h-6 w-6 text-gray-400" />
          <span className="text-sm font-medium text-gray-800">Ajouter plusieurs fichiers</span>
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
            <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Nouveaux fichiers selectionnes</p>
            <ul className="space-y-1 text-sm text-gray-700">
              {files.map((file) => (
                <li key={`${file.name}-${file.size}-${file.lastModified}`} className="flex justify-between gap-3">
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
              {isPending ? 'Envoi en cours...' : 'Envoyer le complement'}
        </button>
      </div>
    </form>
  )
}
