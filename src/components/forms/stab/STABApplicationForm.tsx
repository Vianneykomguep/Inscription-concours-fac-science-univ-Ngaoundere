'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import type { StabFormConfig } from '@/lib/stab-config'
import AcademicSection from './AcademicSection'
import CandidateIdentitySection from './CandidateIdentitySection'
import CandidateSignatureSection from './CandidateSignatureSection'
import CompetitionCenterSection from './CompetitionCenterSection'
import FiliereSelector from './FiliereSelector'
import ReceiptPreview from './ReceiptPreview'
import RequiredDocumentsSection from './RequiredDocumentsSection'
import type { ReceiptData, StabFormData, UploadedDocumentState } from './types'

type Props = {
  config: StabFormConfig
}

export default function STABApplicationForm({ config }: Props) {
  const storageKey = `stab-form-draft:${config.type}`
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [receipt, setReceipt] = useState<ReceiptData | null>(null)
  const [photo, setPhoto] = useState<File | null>(null)
  const [documents, setDocuments] = useState<UploadedDocumentState>({})
  const [data, setData] = useState<StabFormData>({
    concoursType: config.type,
    nom: '',
    prenom: '',
    dateNaissance: '',
    lieuNaissance: '',
    genre: '',
    nationalite: 'Camerounaise',
    regionOrigine: '',
    departementOrigine: '',
    telephone: '',
    photoUrl: '',
    filiere: '',
    centre: '',
    signatureCandidat: '',
    academic: {},
  })

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey)
    if (!saved) return

    try {
      setData((current) => ({ ...current, ...JSON.parse(saved), concoursType: config.type }))
    } catch {
      window.localStorage.removeItem(storageKey)
    }
  }, [config.type, storageKey])

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(data))
  }, [data, storageKey])

  const requiredMissing = useMemo(
    () => config.documents.some((document) => document.required && !documents[document.type]),
    [config.documents, documents],
  )

  const updateField = (field: keyof StabFormData, value: string) => {
    setData((current) => ({ ...current, [field]: value }))
  }

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!photo) {
      setError('La photo du candidat est requise.')
      return
    }

    if (requiredMissing) {
      setError('Veuillez fournir toutes les pièces obligatoires.')
      return
    }

    const payload = new FormData()
    payload.append('data', JSON.stringify(data))
    payload.append('photo', photo)

    for (const [type, file] of Object.entries(documents)) {
      if (file) payload.append(`document:${type}`, file)
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/candidatures/stab', {
          method: 'POST',
          body: payload,
        })
        const result = await response.json()

        if (!response.ok) {
          setError(result.error || 'Impossible de soumettre la candidature.')
          return
        }

        window.localStorage.removeItem(storageKey)
        setReceipt(result.receipt)
      } catch {
        setError('Impossible de soumettre la candidature. Vérifiez votre connexion puis réessayez.')
      }
    })
  }

  if (receipt) {
    return <ReceiptPreview receipt={receipt} />
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
        Vos informations sont sauvegardees automatiquement sur cet appareil pendant le remplissage. Le recepisse officiel sera envoye par email apres validation du dossier par l'administration.
      </div>
      <CandidateIdentitySection data={data} photo={photo} onPhotoChange={setPhoto} onChange={updateField} />
      <AcademicSection type={config.type} data={data} onChange={(academic) => setData((current) => ({ ...current, academic }))} />
      <CompetitionCenterSection centers={config.centers} value={data.centre} onChange={(value) => updateField('centre', value)} />
      <FiliereSelector filieres={config.filieres} value={data.filiere} onChange={(value) => updateField('filiere', value)} />
      <RequiredDocumentsSection documents={config.documents} values={documents} onChange={(type, file) => setDocuments((current) => ({ ...current, [type]: file }))} />
      <CandidateSignatureSection data={data} onChange={updateField} />

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="flex justify-end">
        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending ? 'Soumission en cours...' : 'Soumettre la candidature'}
        </button>
      </div>
    </form>
  )
}
