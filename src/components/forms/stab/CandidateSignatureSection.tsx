'use client'

import type { StabFormData } from './types'

type Props = {
  data: StabFormData
  onChange: (field: keyof StabFormData, value: string) => void
}

export default function CandidateSignatureSection({ data, onChange }: Props) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">Validation</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label-field" htmlFor="signatureCandidat">Signature candidat *</label>
          <input
            id="signatureCandidat"
            className="input-field"
            value={data.signatureCandidat}
            onChange={(event) => onChange('signatureCandidat', event.target.value)}
            placeholder="Nom et prénom du candidat"
            required
          />
        </div>
        <div>
          <label className="label-field" htmlFor="signatureAgent">Signature agent accueil</label>
          <input
            id="signatureAgent"
            className="input-field"
            value={data.signatureAgent}
            onChange={(event) => onChange('signatureAgent', event.target.value)}
            placeholder="Réservé à l'administration"
          />
        </div>
      </div>
    </section>
  )
}
