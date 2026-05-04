'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'

interface Concours {
  id: string
  titre: string
  description: string
  departement: string
  nombrePlaces: number
  fraisInscription: number
  dateOuverture: string
  dateCloture: string
  dateConcours: string | null
  dateResultats: string | null
  conditionsAdmission: string | null
  guideUrl: string | null
}

export default function EditConcoursPage({ params }: { params: { id: string } }) {
  const [concours, setConcours] = useState<Concours | null>(null)
  const [form, setForm] = useState<Partial<Concours>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    const fetchConcours = async () => {
      try {
        const res = await fetch(`/api/admin/concours/${params.id}`)
        if (!res.ok) throw new Error('Concours non trouvé')
        const data = await res.json()
        setConcours(data)
        setForm({
          titre: data.titre,
          description: data.description,
          departement: data.departement,
          nombrePlaces: data.nombrePlaces,
          fraisInscription: data.fraisInscription,
          dateOuverture: data.dateOuverture?.split('T')[0],
          dateCloture: data.dateCloture?.split('T')[0],
          dateConcours: data.dateConcours?.split('T')[0],
          dateResultats: data.dateResultats?.split('T')[0],
          conditionsAdmission: data.conditionsAdmission,
          guideUrl: data.guideUrl,
        })
      } catch (error) {
        setMessage('Impossible de charger le concours')
      }
    }
    fetchConcours()
  }, [params.id])

  const updateField = (field: keyof Concours, value: any) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrors({})
    setMessage(null)

    const payload = {
      titre: form.titre?.trim(),
      description: form.description?.trim(),
      departement: form.departement?.trim(),
      nombrePlaces: Number(form.nombrePlaces),
      fraisInscription: Number(form.fraisInscription),
      dateOuverture: form.dateOuverture,
      dateCloture: form.dateCloture,
      dateConcours: form.dateConcours || undefined,
      dateResultats: form.dateResultats || undefined,
      conditionsAdmission: form.conditionsAdmission?.trim() || undefined,
      guideUrl: form.guideUrl?.trim() || undefined,
    }

    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/concours/${params.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const data = await response.json()
          setMessage(data?.error || 'Une erreur est survenue.')
          return
        }

        router.push('/admin/concours')
      } catch (error) {
        setMessage('Impossible de modifier le concours. Veuillez réessayer.')
      }
    })
  }

  if (!concours) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600">Chargement...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modifier le concours</h1>
          <p className="mt-1 text-sm text-gray-600">Mettez à jour les informations du concours</p>
        </div>
        <Link href="/admin/concours" className="btn-secondary w-full text-center md:w-auto">
          Retour à la liste
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-gray-200 bg-white p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="label-field">Titre du concours</label>
            <input
              className="input-field"
              value={form.titre || ''}
              onChange={(e) => updateField('titre', e.target.value)}
            />
          </div>

          <div>
            <label className="label-field">Département / Filière</label>
            <input
              className="input-field"
              value={form.departement || ''}
              onChange={(e) => updateField('departement', e.target.value)}
            />
          </div>

          <div>
            <label className="label-field">Nombre de places</label>
            <input
              type="number"
              min="1"
              className="input-field"
              value={form.nombrePlaces || ''}
              onChange={(e) => updateField('nombrePlaces', e.target.value)}
            />
          </div>

          <div>
            <label className="label-field">Frais d'inscription (XAF)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="input-field"
              value={form.fraisInscription || ''}
              onChange={(e) => updateField('fraisInscription', e.target.value)}
            />
          </div>

          <div>
            <label className="label-field">Date d'ouverture</label>
            <input
              type="date"
              className="input-field"
              value={form.dateOuverture || ''}
              onChange={(e) => updateField('dateOuverture', e.target.value)}
            />
          </div>

          <div>
            <label className="label-field">Date de clôture</label>
            <input
              type="date"
              className="input-field"
              value={form.dateCloture || ''}
              onChange={(e) => updateField('dateCloture', e.target.value)}
            />
          </div>

          <div>
            <label className="label-field">Date du concours</label>
            <input
              type="date"
              className="input-field"
              value={form.dateConcours || ''}
              onChange={(e) => updateField('dateConcours', e.target.value)}
            />
          </div>

          <div>
            <label className="label-field">Date des résultats</label>
            <input
              type="date"
              className="input-field"
              value={form.dateResultats || ''}
              onChange={(e) => updateField('dateResultats', e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="label-field">URL du guide</label>
            <input
              className="input-field"
              value={form.guideUrl || ''}
              onChange={(e) => updateField('guideUrl', e.target.value)}
              placeholder="https://example.com/guide.pdf"
            />
          </div>
        </div>

        <div>
          <label className="label-field">Description</label>
          <textarea
            rows={5}
            className="input-field min-h-[140px] resize-none"
            value={form.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
          />
        </div>

        <div>
          <label className="label-field">Conditions d'admission</label>
          <textarea
            rows={4}
            className="input-field min-h-[120px] resize-none"
            value={form.conditionsAdmission || ''}
            onChange={(e) => updateField('conditionsAdmission', e.target.value)}
          />
        </div>

        {message && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{message}</div>}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Link href="/admin/concours" className="btn-secondary w-full sm:w-auto">
            Annuler
          </Link>
          <button type="submit" disabled={isPending} className="btn-primary w-full sm:w-auto">
            {isPending ? 'Enregistrement...' : 'Modifier le concours'}
          </button>
        </div>
      </form>
    </div>
  )
}
