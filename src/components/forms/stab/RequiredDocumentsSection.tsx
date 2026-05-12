'use client'

import type { StabDocument } from '@/lib/stab-config'
import type { UploadedDocumentState } from './types'

type Props = {
  documents: StabDocument[]
  values: UploadedDocumentState
  onChange: (type: string, file: File | null) => void
}

export default function RequiredDocumentsSection({ documents, values, onChange }: Props) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Pièces à fournir</h2>
        <p className="mt-1 text-sm text-gray-500">Formats acceptés : PDF, JPG, PNG. Taille maximale : 5 Mo par fichier.</p>
      </div>

      <div className="space-y-4">
        {documents.map((document) => (
          <div key={document.type} className="rounded-lg border border-gray-200 p-4">
            <label className="label-field" htmlFor={document.type}>
              {document.label}{document.required ? ' *' : ''}
            </label>
            <input
              id={document.type}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="input-field"
              required={document.required && !values[document.type]}
              onChange={(event) => onChange(document.type, event.target.files?.[0] ?? null)}
            />
            {values[document.type] && <p className="mt-2 text-sm text-green-700">{values[document.type]?.name}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}
