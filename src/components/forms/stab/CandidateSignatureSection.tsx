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
        <p className="mt-2 text-sm text-gray-500">
          Saisissez votre nom complet pour confirmer l'exactitude des informations fournies.
        </p>
      </div>
    </section>
  )
}
