'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

const initialForm = {
  titre: '',
  description: '',
  departement: '',
  nombrePlaces: '1',
  fraisInscription: '0',
  dateOuverture: '',
  dateCloture: '',
  dateConcours: '',
  dateResultats: '',
  conditionsAdmission: '',
  guideUrl: '',
}

export default function AdminCreateConcoursPage() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const updateField = (field: string, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrors({})
    setMessage(null)

    const payload = {
      titre: form.titre.trim(),
      description: form.description.trim(),
      departement: form.departement.trim(),
      nombrePlaces: Number(form.nombrePlaces),
      fraisInscription: Number(form.fraisInscription),
      dateOuverture: form.dateOuverture,
      dateCloture: form.dateCloture,
      dateConcours: form.dateConcours || undefined,
      dateResultats: form.dateResultats || undefined,
      conditionsAdmission: form.conditionsAdmission.trim() || undefined,
      guideUrl: form.guideUrl.trim() || undefined,
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/admin/concours', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const data = await response.json()
        if (!response.ok) {
          if (data?.details) {
            const fieldErrors: Record<string, string> = {}
            for (const error of data.details) {
              const field = error.path?.[0] as string
              fieldErrors[field] = error.message
            }
            setErrors(fieldErrors)
            return
          }
          setMessage(data?.error || 'Une erreur est survenue.')
          return
        }

        router.push('/admin/concours')
      } catch (error) {
        setMessage('Impossible de créer le concours. Veuillez réessayer.')
      }
    })
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Créer un nouveau concours</h1>
          <p className="mt-1 text-sm text-gray-600">Remplissez les informations ci-dessous pour ajouter un concours à la plateforme.</p>
        </div>
        <Link href="/admin/concours" className="btn-secondary w-full text-center md:w-auto">
          Retour à la liste
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-gray-200 bg-white p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="label-field" htmlFor="titre">Titre du concours</label>
            <input
              id="titre"
              className="input-field"
              value={form.titre}
              onChange={(e) => updateField('titre', e.target.value)}
              placeholder="Ex : Master Informatique"
            />
            {errors.titre && <p className="mt-2 text-sm text-red-600">{errors.titre}</p>}
          </div>

          <div>
            <label className="label-field" htmlFor="departement">Département / Filière</label>
            <input
              id="departement"
              className="input-field"
              value={form.departement}
              onChange={(e) => updateField('departement', e.target.value)}
              placeholder="Ex : Informatique"
            />
            {errors.departement && <p className="mt-2 text-sm text-red-600">{errors.departement}</p>}
          </div>

          <div>
            <label className="label-field" htmlFor="nombrePlaces">Nombre de places</label>
            <input
              id="nombrePlaces"
              type="number"
              min="1"
              className="input-field"
              value={form.nombrePlaces}
              onChange={(e) => updateField('nombrePlaces', e.target.value)}
            />
            {errors.nombrePlaces && <p className="mt-2 text-sm text-red-600">{errors.nombrePlaces}</p>}
          </div>

          <div>
            <label className="label-field" htmlFor="fraisInscription">Frais d'inscription (XAF)</label>
            <input
              id="fraisInscription"
              type="number"
              min="0"
              step="0.01"
              className="input-field"
              value={form.fraisInscription}
              onChange={(e) => updateField('fraisInscription', e.target.value)}
            />
            {errors.fraisInscription && <p className="mt-2 text-sm text-red-600">{errors.fraisInscription}</p>}
          </div>

          <div>
            <label className="label-field" htmlFor="dateOuverture">Date d'ouverture</label>
            <input
              id="dateOuverture"
              type="date"
              className="input-field"
              value={form.dateOuverture}
              onChange={(e) => updateField('dateOuverture', e.target.value)}
            />
            {errors.dateOuverture && <p className="mt-2 text-sm text-red-600">{errors.dateOuverture}</p>}
          </div>

          <div>
            <label className="label-field" htmlFor="dateCloture">Date de clôture</label>
            <input
              id="dateCloture"
              type="date"
              className="input-field"
              value={form.dateCloture}
              onChange={(e) => updateField('dateCloture', e.target.value)}
            />
            {errors.dateCloture && <p className="mt-2 text-sm text-red-600">{errors.dateCloture}</p>}
          </div>

          <div>
            <label className="label-field" htmlFor="dateConcours">Date du concours</label>
            <input
              id="dateConcours"
              type="date"
              className="input-field"
              value={form.dateConcours}
              onChange={(e) => updateField('dateConcours', e.target.value)}
            />
          </div>

          <div>
            <label className="label-field" htmlFor="dateResultats">Date des résultats</label>
            <input
              id="dateResultats"
              type="date"
              className="input-field"
              value={form.dateResultats}
              onChange={(e) => updateField('dateResultats', e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="label-field" htmlFor="guideUrl">URL du guide</label>
            <input
              id="guideUrl"
              className="input-field"
              value={form.guideUrl}
              onChange={(e) => updateField('guideUrl', e.target.value)}
              placeholder="https://example.com/guide.pdf"
            />
          </div>
        </div>

        <div>
          <label className="label-field" htmlFor="description">Description</label>
          <textarea
            id="description"
            rows={5}
            className="input-field min-h-[140px] resize-none"
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Décrivez le concours et les objectifs du programme"
          />
          {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
        </div>

        <div>
          <label className="label-field" htmlFor="conditionsAdmission">Conditions d'admission (facultatif)</label>
          <textarea
            id="conditionsAdmission"
            rows={4}
            className="input-field min-h-[120px] resize-none"
            value={form.conditionsAdmission}
            onChange={(e) => updateField('conditionsAdmission', e.target.value)}
            placeholder="Précisez les conditions requises pour candidater"
          />
        </div>

        {message && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{message}</div>}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Link href="/admin/concours" className="btn-secondary w-full sm:w-auto">Annuler</Link>
          <button type="submit" disabled={isPending} className="btn-primary w-full sm:w-auto">
            {isPending ? 'Enregistrement...' : 'Créer le concours'}
          </button>
        </div>
      </form>
    </div>
  )
}
