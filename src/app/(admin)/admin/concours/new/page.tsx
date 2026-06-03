'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import type { ConcoursType } from '@prisma/client'
import {
  DEPARTMENT_OPTIONS,
  LEVEL_OPTIONS,
  STAB_FORM_CONFIGS,
  getAvailableLevelsForDepartment,
  getConcoursTypeFromDepartmentAndLevel,
  getDepartmentAndLevelFromConcoursType,
} from '@/lib/stab-config'

const initialForm = {
  type: 'IAA_MAF_M1' as ConcoursType,
  niveau: 'M1',
  titre: '',
  description: '',
  departement: 'IAA-MAF',
  nombrePlaces: '1',
  fraisInscription: '0',
  dateOuverture: '',
  dateCloture: '',
  dateConcours: '',
  dateResultats: '',
  conditionsAdmission: '',
  guideUrl: '',
  filieres: '',
  centres: '',
  piecesRequises: '',
  isActive: true,
}

export default function AdminCreateConcoursPage() {
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    const config = STAB_FORM_CONFIGS[form.type]
    const selection = getDepartmentAndLevelFromConcoursType(form.type)
    setForm((current) => ({
      ...current,
      niveau: selection.niveau,
      titre: current.titre || config.title,
      description: current.description || config.subtitle,
      departement: config.departement,
      filieres: config.filieres.join('\n'),
      centres: config.centers.join('\n'),
      piecesRequises: config.documents.map((document) => document.label).join('\n'),
    }))
  }, [form.type])

  const updateField = (field: keyof typeof initialForm, value: string | boolean) => {
    setForm((current) => {
      if (field === 'departement') {
        const nextLevel = getAvailableLevelsForDepartment(String(value))[0]
        return {
          ...current,
          departement: String(value),
          niveau: nextLevel,
          type: getConcoursTypeFromDepartmentAndLevel(String(value), nextLevel),
          titre: '',
          description: '',
        }
      }

      if (field === 'niveau') {
        return {
          ...current,
          niveau: String(value),
          type: getConcoursTypeFromDepartmentAndLevel(current.departement, String(value)),
          titre: '',
          description: '',
        }
      }

      return { ...current, [field]: value }
    })
  }

  const lines = (value: string) => value.split('\n').map((item) => item.trim()).filter(Boolean)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)

    const payload = {
      type: form.type,
      titre: form.titre.trim(),
      description: form.description.trim(),
      departement: form.departement.trim(),
      filieres: lines(form.filieres),
      centres: lines(form.centres),
      piecesRequises: lines(form.piecesRequises),
      nombrePlaces: Number(form.nombrePlaces),
      fraisInscription: Number(form.fraisInscription),
      dateOuverture: form.dateOuverture,
      dateCloture: form.dateCloture,
      dateConcours: form.dateConcours || undefined,
      dateResultats: form.dateResultats || undefined,
      conditionsAdmission: form.conditionsAdmission.trim() || undefined,
      guideUrl: form.guideUrl.trim() || undefined,
      isActive: form.isActive,
    }

    startTransition(async () => {
      const response = await fetch('/api/admin/concours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        setMessage(data.message || data.error || 'Impossible de créer le concours.')
        return
      }

      router.push('/admin/concours')
    })
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Créer un concours STAB</h1>
          <p className="mt-1 text-sm text-gray-600">Configurez le niveau, les dates, frais, filieres, centres et pieces demandees.</p>
        </div>
        <Link href="/admin/concours" className="btn-secondary w-full text-center md:w-auto">Retour à la liste</Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-gray-200 bg-white p-6">
        <ConcoursFields form={form} updateField={updateField} />
        {message && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{message}</div>}
        <div className="flex justify-end gap-3">
          <Link href="/admin/concours" className="btn-secondary">Annuler</Link>
          <button type="submit" disabled={isPending} className="btn-primary">{isPending ? 'Enregistrement...' : 'Créer le concours'}</button>
        </div>
      </form>
    </div>
  )
}

function ConcoursFields({ form, updateField }: { form: typeof initialForm; updateField: (field: keyof typeof initialForm, value: string | boolean) => void }) {
  const availableLevels = getAvailableLevelsForDepartment(form.departement)

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="label-field">Niveau du concours</label>
          <select className="input-field" value={form.niveau} onChange={(event) => updateField('niveau', event.target.value)}>
            {LEVEL_OPTIONS.filter((option) => availableLevels.includes(option.value)).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </div>
        <div>
          <label className="label-field">Département</label>
          <select className="input-field" value={form.departement} onChange={(event) => updateField('departement', event.target.value)}>
            {DEPARTMENT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </div>
        <Field label="Titre" value={form.titre} onChange={(value) => updateField('titre', value)} />
        <Field label="Nombre de places" type="number" value={form.nombrePlaces} onChange={(value) => updateField('nombrePlaces', value)} />
        <Field label="Frais d'inscription (XAF)" type="number" value={form.fraisInscription} onChange={(value) => updateField('fraisInscription', value)} />
        <Field label="Date d'ouverture" type="date" value={form.dateOuverture} onChange={(value) => updateField('dateOuverture', value)} />
        <Field label="Date de clôture" type="date" value={form.dateCloture} onChange={(value) => updateField('dateCloture', value)} />
        <Field label="Date du concours" type="date" value={form.dateConcours} onChange={(value) => updateField('dateConcours', value)} />
        <Field label="Date des résultats" type="date" value={form.dateResultats} onChange={(value) => updateField('dateResultats', value)} />
        <Field label="URL du guide" value={form.guideUrl} onChange={(value) => updateField('guideUrl', value)} />
      </div>

      <Textarea label="Description" value={form.description} onChange={(value) => updateField('description', value)} />
      <Textarea label="Conditions d'admission" value={form.conditionsAdmission} onChange={(value) => updateField('conditionsAdmission', value)} />

      <div className="grid gap-6 md:grid-cols-3">
        <Textarea label="Filières (une par ligne)" value={form.filieres} onChange={(value) => updateField('filieres', value)} />
        <Textarea label="Centres (un par ligne)" value={form.centres} onChange={(value) => updateField('centres', value)} />
        <Textarea label="Pièces demandées (une par ligne)" value={form.piecesRequises} onChange={(value) => updateField('piecesRequises', value)} />
      </div>

      <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
        <input type="checkbox" checked={form.isActive} onChange={(event) => updateField('isActive', event.target.checked)} />
        Concours actif
      </label>
    </>
  )
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <div>
      <label className="label-field">{label}</label>
      <input type={type} className="input-field" value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  )
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="label-field">{label}</label>
      <textarea className="input-field min-h-[120px]" value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  )
}
