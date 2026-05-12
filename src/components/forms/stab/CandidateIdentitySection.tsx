'use client'

import PhotoUploadField from './PhotoUploadField'
import type { StabFormData } from './types'

type Props = {
  data: StabFormData
  photo: File | null
  onPhotoChange: (file: File | null) => void
  onChange: (field: keyof StabFormData, value: string) => void
}

export default function CandidateIdentitySection({ data, photo, onPhotoChange, onChange }: Props) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Identification du candidat</h2>
        <p className="mt-1 text-sm text-gray-500">Informations personnelles utilisées pour le dossier et le récépissé.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nom" value={data.nom} onChange={(value) => onChange('nom', value)} required />
        <Field label="Prénom" value={data.prenom} onChange={(value) => onChange('prenom', value)} required />
        <Field label="Date de naissance" type="date" value={data.dateNaissance} onChange={(value) => onChange('dateNaissance', value)} required />
        <Field label="Lieu de naissance" value={data.lieuNaissance} onChange={(value) => onChange('lieuNaissance', value)} required />

        <div>
          <label className="label-field" htmlFor="genre">Genre</label>
          <select id="genre" className="input-field" value={data.genre} onChange={(event) => onChange('genre', event.target.value)} required>
            <option value="">Sélectionner</option>
            <option value="Masculin">Masculin</option>
            <option value="Féminin">Féminin</option>
          </select>
        </div>

        <Field label="Nationalité" value={data.nationalite} onChange={(value) => onChange('nationalite', value)} required />
        <Field label="Région d'origine" value={data.regionOrigine} onChange={(value) => onChange('regionOrigine', value)} required />
        <Field label="Département d'origine" value={data.departementOrigine} onChange={(value) => onChange('departementOrigine', value)} required />
        <Field label="Téléphone" value={data.telephone} onChange={(value) => onChange('telephone', value)} />
        <PhotoUploadField value={photo} onChange={onPhotoChange} />
      </div>
    </section>
  )
}

function Field({
  label,
  type = 'text',
  value,
  required,
  onChange,
}: {
  label: string
  type?: string
  value: string
  required?: boolean
  onChange: (value: string) => void
}) {
  const id = label.toLowerCase().replaceAll(' ', '-')

  return (
    <div>
      <label className="label-field" htmlFor={id}>{label}{required ? ' *' : ''}</label>
      <input id={id} type={type} className="input-field" value={value} onChange={(event) => onChange(event.target.value)} required={required} />
    </div>
  )
}
