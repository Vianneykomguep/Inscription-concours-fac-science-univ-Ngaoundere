'use client'

import type { ConcoursType } from '@prisma/client'
import type { StabFormData } from './types'

type Props = {
  type: ConcoursType
  data: StabFormData
  onChange: (academic: Record<string, string>) => void
}

const FIELDS: Record<ConcoursType, { name: string; label: string; type?: string }[]> = {
  STAB_L1: [
    { name: 'anneeProbatoire', label: 'Année obtention Probatoire', type: 'number' },
    { name: 'mentionProbatoire', label: 'Mention Probatoire' },
    { name: 'anneeBac', label: 'Année obtention BAC', type: 'number' },
    { name: 'mentionBac', label: 'Mention BAC' },
  ],
  STAB_L3: [
    { name: 'diplomeAcces', label: "Diplôme d'accès" },
    { name: 'etablissement', label: 'Établissement' },
    { name: 'anneeObtention', label: "Année d'obtention", type: 'number' },
    { name: 'mention', label: 'Mention' },
  ],
  STAB_MASTER: [
    { name: 'licence', label: 'Licence obtenue' },
    { name: 'etablissement', label: 'Établissement' },
    { name: 'anneeObtention', label: "Année d'obtention", type: 'number' },
    { name: 'mention', label: 'Mention' },
  ],
  STAB_MASTER_PRO: [
    { name: 'licenceProfessionnelle', label: 'Licence professionnelle obtenue' },
    { name: 'etablissement', label: 'Établissement' },
    { name: 'anneeObtention', label: "Année d'obtention", type: 'number' },
    { name: 'mention', label: 'Mention' },
  ],
}

export default function AcademicSection({ type, data, onChange }: Props) {
  const update = (name: string, value: string) => onChange({ ...data.academic, [name]: value })

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">Informations académiques</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {FIELDS[type].map((field) => (
          <div key={field.name}>
            <label className="label-field" htmlFor={field.name}>{field.label}</label>
            <input
              id={field.name}
              type={field.type ?? 'text'}
              className="input-field"
              value={data.academic[field.name] ?? ''}
              onChange={(event) => update(field.name, event.target.value)}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
