'use client'

import type { ConcoursType } from '@prisma/client'
import type { StabFormData } from './types'

type Props = {
  type: ConcoursType
  data: StabFormData
  onChange: (academic: Record<string, string>) => void
}

const FIELDS: Record<ConcoursType, { name: string; label: string; type?: string }[]> = {
  IAA_MAF_M1: [
    { name: 'licence', label: 'Licence ou diplome equivalent' },
    { name: 'etablissement', label: 'Etablissement' },
    { name: 'anneeObtention', label: "Annee d'obtention", type: 'number' },
    { name: 'mention', label: 'Mention' },
  ],
  STAB_L1: [
    { name: 'anneeProbatoire', label: 'Annee obtention Probatoire', type: 'number' },
    { name: 'mentionProbatoire', label: 'Mention Probatoire' },
    { name: 'anneeBac', label: 'Annee obtention BAC', type: 'number' },
    { name: 'mentionBac', label: 'Mention BAC' },
  ],
  STAB_L3: [
    { name: 'anneeProbatoire', label: 'Annee obtention Probatoire ou GCE O/L', type: 'number' },
    { name: 'mentionProbatoire', label: 'Mention Probatoire ou GCE O/L' },
    { name: 'anneeBac', label: 'Annee obtention BAC ou GCE A/L', type: 'number' },
    { name: 'mentionBac', label: 'Mention BAC ou GCE A/L' },
  ],
  STAB_MASTER: [
    { name: 'anneeBac', label: 'Annee obtention BAC ou GCE A/L', type: 'number' },
    { name: 'mentionBac', label: 'Mention BAC ou GCE A/L' },
    { name: 'anneeLicence', label: 'Annee obtention Licence', type: 'number' },
    { name: 'mentionLicence', label: 'Mention Licence' },
  ],
  STAB_MASTER_PRO: [
    { name: 'anneeBac', label: 'Annee obtention BAC ou GCE A/L', type: 'number' },
    { name: 'mentionBac', label: 'Mention BAC ou GCE A/L' },
    { name: 'anneeLicence', label: 'Annee obtention Licence', type: 'number' },
    { name: 'mentionLicence', label: 'Mention Licence' },
  ],
  BIOMED_L1: [
    { name: 'anneeProbatoire', label: 'Annee obtention Probatoire ou GCE O/L', type: 'number' },
    { name: 'mentionProbatoire', label: 'Mention Probatoire ou GCE O/L' },
    { name: 'anneeBac', label: 'Annee obtention Baccalaureat ou GCE A/L', type: 'number' },
    { name: 'mentionBac', label: 'Mention Baccalaureat ou GCE A/L' },
  ],
  BIOMED_L3: [
    { name: 'diplomeAcces', label: "Diplome d'acces en Licence 3 professionnelle" },
    { name: 'etablissement', label: 'Etablissement' },
    { name: 'anneeObtention', label: "Annee d'obtention", type: 'number' },
    { name: 'mention', label: 'Mention' },
  ],
  BIOMED_MASTER: [
    { name: 'licence', label: 'Licence ou diplome equivalent' },
    { name: 'etablissement', label: 'Etablissement' },
    { name: 'anneeObtention', label: "Annee d'obtention", type: 'number' },
    { name: 'mention', label: 'Mention' },
  ],
  BIOMED_MASTER_PRO: [
    { name: 'licenceProfessionnelle', label: 'Licence professionnelle ou diplome equivalent' },
    { name: 'etablissement', label: 'Etablissement' },
    { name: 'anneeObtention', label: "Annee d'obtention", type: 'number' },
    { name: 'mention', label: 'Mention' },
    { name: 'experienceProfessionnelle', label: 'Stage ou experience professionnelle' },
  ],
}

export default function AcademicSection({ type, data, onChange }: Props) {
  const update = (name: string, value: string) => onChange({ ...data.academic, [name]: value })

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">Informations academiques</h2>
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
