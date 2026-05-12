'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import type { ConcoursType } from '@prisma/client'

const TYPES: ConcoursType[] = ['STAB_L1', 'STAB_L3', 'STAB_MASTER', 'STAB_MASTER_PRO']

type FormState = {
  type: ConcoursType
  titre: string
  description: string
  departement: string
  nombrePlaces: string
  fraisInscription: string
  dateOuverture: string
  dateCloture: string
  dateConcours: string
  dateResultats: string
  conditionsAdmission: string
  guideUrl: string
  filieres: string
  centres: string
  piecesRequises: string
  isActive: boolean
}

const emptyForm: FormState = {
  type: 'STAB_L1',
  titre: '',
  description: '',
  departement: 'STAB',
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

export default function EditConcoursPage({ params }: { params: { id: string } }) {
  const [form, setForm] = useState<FormState | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/admin/concours/${params.id}`)
      .then((response) => {
        if (!response.ok) throw new Error('Concours non trouvé')
        return response.json()
      })
      .then((concours) => {
        setForm({
          type: concours.type,
          titre: concours.titre,
          description: concours.description,
          departement: concours.departement,
          nombrePlaces: String(concours.nombrePlaces),
          fraisInscription: String(concours.fraisInscription),
          dateOuverture: concours.dateOuverture?.split('T')[0] ?? '',
          dateCloture: concours.dateCloture?.split('T')[0] ?? '',
          dateConcours: concours.dateConcours?.split('T')[0] ?? '',
          dateResultats: concours.dateResultats?.split('T')[0] ?? '',
          conditionsAdmission: concours.conditionsAdmission ?? '',
          guideUrl: concours.guideUrl ?? '',
          filieres: (concours.filieres ?? []).join('\n'),
          centres: (concours.centres ?? []).join('\n'),
          piecesRequises: (concours.piecesRequises ?? []).join('\n'),
          isActive: concours.isActive ?? true,
        })
      })
      .catch(() => setMessage('Impossible de charger le concours'))
  }, [params.id])

  const updateField = (field: keyof FormState, value: string | boolean) => {
    setForm((current) => current ? { ...current, [field]: value } : current)
  }

  const lines = (value: string) => value.split('\n').map((item) => item.trim()).filter(Boolean)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form) return
    setMessage(null)

    startTransition(async () => {
      const response = await fetch(`/api/admin/concours/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setMessage(data?.error || 'Impossible de modifier le concours.')
        return
      }

      router.push('/admin/concours')
    })
  }

  if (!form) {
    return <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-600">{message ?? 'Chargement...'}</div>
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modifier le concours</h1>
          <p className="mt-1 text-sm text-gray-600">Mettez à jour les dates, frais, filières, centres et pièces demandées.</p>
        </div>
        <Link href="/admin/concours" className="btn-secondary w-full text-center md:w-auto">Retour à la liste</Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-gray-200 bg-white p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="label-field">Type de concours</label>
            <select className="input-field" value={form.type} onChange={(event) => updateField('type', event.target.value as ConcoursType)}>
              {TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <Field label="Département" value={form.departement} onChange={(value) => updateField('departement', value)} />
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

        {message && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{message}</div>}

        <div className="flex justify-end gap-3">
          <Link href="/admin/concours" className="btn-secondary">Annuler</Link>
          <button type="submit" disabled={isPending} className="btn-primary">{isPending ? 'Enregistrement...' : 'Modifier le concours'}</button>
        </div>
      </form>
    </div>
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
