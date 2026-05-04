'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ChevronRight, ChevronLeft, Loader2, Upload, FileText, GraduationCap, User, CreditCard, ClipboardCheck } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const STEPS = [
  { num: 1, title: 'Choix du concours', icon: GraduationCap },
  { num: 2, title: 'Informations personnelles', icon: User },
  { num: 3, title: 'Parcours académique', icon: FileText },
  { num: 4, title: 'Documents', icon: Upload },
  { num: 5, title: 'Paiement', icon: CreditCard },
  { num: 6, title: 'Récapitulatif', icon: ClipboardCheck },
]

export default function NewCandidaturePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [concoursList, setConcoursList] = useState<any[]>([])
  const [candidatureId, setCandidatureId] = useState<string | null>(null)
  const [form, setForm] = useState({
    concoursId: '', nom: '', prenom: '', dateNaissance: '', lieuNaissance: '',
    sexe: 'M', nationalite: 'Camerounaise', telephone: '', adresse: '', ville: '',
    dernierDiplome: '', etablissement: '', anneeObtention: '', mention: '', autresFormations: '',
  })
  const [documents, setDocuments] = useState<{ type: string; file: File | null; uploaded?: boolean }[]>([
    { type: 'diplome', file: null }, { type: 'acte_naissance', file: null },
    { type: 'photo_identite', file: null }, { type: 'releves_notes', file: null },
  ])
  const [quitus, setQuitus] = useState<File | null>(null)
  const [selectedConcours, setSelectedConcours] = useState<any>(null)

  useEffect(() => {
    fetch('/api/concours').then(r => r.json()).then(setConcoursList).catch(console.error)
  }, [])

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const createCandidature = async () => {
    const res = await fetch('/api/candidatures', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ concoursId: form.concoursId }),
    })
    const data = await res.json()
    if (!res.ok) { if (data.candidatureId) { setCandidatureId(data.candidatureId); return true } throw new Error(data.error) }
    setCandidatureId(data.id)
    return true
  }

  const saveCandidature = async (data: any) => {
    if (!candidatureId) return
    await fetch(`/api/candidatures/${candidatureId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, etapeActuelle: step + 1 }),
    })
  }

  const uploadDocument = async (type: string, file: File) => {
    if (!candidatureId) return
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    await fetch(`/api/candidatures/${candidatureId}/documents`, { method: 'POST', body: formData })
  }

  const uploadQuitus = async () => {
    if (!candidatureId || !quitus) return
    const formData = new FormData()
    formData.append('file', quitus)
    formData.append('type', 'quitus_paiement')
    await fetch(`/api/candidatures/${candidatureId}/documents`, { method: 'POST', body: formData })
  }

  const handleNext = async () => {
    setError('')
    setLoading(true)
    try {
      if (step === 1) {
        if (!form.concoursId) { setError('Veuillez sélectionner un concours'); return }
        setSelectedConcours(concoursList.find(c => c.id === form.concoursId))
        await createCandidature()
      } else if (step === 2) {
        if (!form.nom || !form.prenom || !form.dateNaissance || !form.lieuNaissance || !form.telephone || !form.adresse || !form.ville) {
          setError('Veuillez remplir tous les champs obligatoires'); return
        }
        await saveCandidature({ nom: form.nom, prenom: form.prenom, dateNaissance: new Date(form.dateNaissance), lieuNaissance: form.lieuNaissance, sexe: form.sexe, nationalite: form.nationalite, telephone: form.telephone, adresse: form.adresse, ville: form.ville })
      } else if (step === 3) {
        if (!form.dernierDiplome || !form.etablissement || !form.anneeObtention) {
          setError('Veuillez remplir les champs obligatoires'); return
        }
        await saveCandidature({ dernierDiplome: form.dernierDiplome, etablissement: form.etablissement, anneeObtention: parseInt(form.anneeObtention), mention: form.mention, autresFormations: form.autresFormations })
      } else if (step === 4) {
        const required = documents.filter(d => ['diplome', 'acte_naissance', 'photo_identite'].includes(d.type))
        if (required.some(d => !d.file)) { setError('Veuillez fournir tous les documents obligatoires'); return }
        for (const doc of documents) { if (doc.file && !doc.uploaded) { await uploadDocument(doc.type, doc.file); doc.uploaded = true } }
      } else if (step === 5) {
        if (!quitus) { setError('Veuillez uploader votre quitus de paiement'); return }
        await uploadQuitus()
      } else if (step === 6) {
        await saveCandidature({ submit: true })
        router.push('/dashboard')
        return
      }
      setStep(s => s + 1)
    } catch (err: any) { setError(err.message || 'Erreur') }
    finally { setLoading(false) }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                step > s.num ? 'bg-uni-green text-white' : step === s.num ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s.num ? <Check className="h-5 w-5" /> : s.num}
              </div>
              {i < STEPS.length - 1 && <div className={`mx-2 h-0.5 w-8 sm:w-16 ${step > s.num ? 'bg-uni-green' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-sm font-medium text-gray-700">Étape {step}: {STEPS[step - 1].title}</p>
      </div>

      <div className="card">
        {error && <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}

        {/* Step 1: Choose concours */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Choisissez votre concours</h2>
            <div className="space-y-3">
              {concoursList.map(c => (
                <label key={c.id} className={`block cursor-pointer rounded-lg border-2 p-4 transition-colors ${form.concoursId === c.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="concours" value={c.id} checked={form.concoursId === c.id} onChange={() => setForm(f => ({ ...f, concoursId: c.id }))} className="sr-only" />
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{c.titre}</p>
                      <p className="text-sm text-gray-500 mt-1">{c.departement} • {c.nombrePlaces} places</p>
                    </div>
                    <span className="text-lg font-bold text-uni-green">{formatCurrency(Number(c.fraisInscription))}</span>
                  </div>
                </label>
              ))}
              {concoursList.length === 0 && <p className="text-center text-gray-500 py-8">Aucun concours disponible actuellement.</p>}
            </div>
          </div>
        )}

        {/* Step 2: Personal info */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Informations personnelles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="label-field">Nom *</label><input className="input-field" value={form.nom} onChange={update('nom')} /></div>
              <div><label className="label-field">Prénom *</label><input className="input-field" value={form.prenom} onChange={update('prenom')} /></div>
              <div><label className="label-field">Date de naissance *</label><input type="date" className="input-field" value={form.dateNaissance} onChange={update('dateNaissance')} /></div>
              <div><label className="label-field">Lieu de naissance *</label><input className="input-field" value={form.lieuNaissance} onChange={update('lieuNaissance')} /></div>
              <div><label className="label-field">Sexe *</label>
                <select className="input-field" value={form.sexe} onChange={update('sexe')}>
                  <option value="M">Masculin</option><option value="F">Féminin</option>
                </select>
              </div>
              <div><label className="label-field">Nationalité *</label><input className="input-field" value={form.nationalite} onChange={update('nationalite')} /></div>
              <div><label className="label-field">Téléphone *</label><input className="input-field" value={form.telephone} onChange={update('telephone')} placeholder="+237 6XX XXX XXX" /></div>
              <div><label className="label-field">Ville *</label><input className="input-field" value={form.ville} onChange={update('ville')} /></div>
              <div className="md:col-span-2"><label className="label-field">Adresse complète *</label><input className="input-field" value={form.adresse} onChange={update('adresse')} /></div>
            </div>
          </div>
        )}

        {/* Step 3: Academic */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Parcours académique</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="label-field">Dernier diplôme obtenu *</label><input className="input-field" value={form.dernierDiplome} onChange={update('dernierDiplome')} placeholder="Ex: Baccalauréat série C" /></div>
              <div><label className="label-field">Établissement *</label><input className="input-field" value={form.etablissement} onChange={update('etablissement')} placeholder="Ex: Lycée de Ngaoundéré" /></div>
              <div><label className="label-field">Année d&apos;obtention *</label><input type="number" className="input-field" value={form.anneeObtention} onChange={update('anneeObtention')} min="1990" max={new Date().getFullYear()} /></div>
              <div><label className="label-field">Mention</label><input className="input-field" value={form.mention} onChange={update('mention')} placeholder="Ex: Bien" /></div>
              <div className="md:col-span-2"><label className="label-field">Autres formations</label><textarea className="input-field min-h-[100px]" value={form.autresFormations} onChange={update('autresFormations')} placeholder="Décrivez vos autres formations ou expériences..." /></div>
            </div>
          </div>
        )}

        {/* Step 4: Documents */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Documents justificatifs</h2>
            <p className="text-sm text-gray-500 mb-6">Formats acceptés : PDF, JPG, PNG. Taille max : 5 Mo par fichier.</p>
            <div className="space-y-4">
              {[
                { type: 'diplome', label: 'Copie légalisée du diplôme *', required: true },
                { type: 'acte_naissance', label: 'Acte de naissance / CNI *', required: true },
                { type: 'photo_identite', label: 'Photo d\'identité *', required: true },
                { type: 'releves_notes', label: 'Relevés de notes', required: false },
              ].map((doc, i) => (
                <div key={doc.type} className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{doc.label}</p>
                      {documents[i].file && <p className="text-sm text-green-600 mt-1">✓ {documents[i].file!.name}</p>}
                    </div>
                    <label className="btn-secondary cursor-pointer text-sm">
                      <Upload className="h-4 w-4 mr-1" /> Choisir
                      <input type="file" className="sr-only" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) setDocuments(d => d.map((dd, j) => j === i ? { ...dd, file, uploaded: false } : dd))
                      }} />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Payment (Quitus upload) */}
        {step === 5 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Paiement des frais d&apos;inscription</h2>
            {selectedConcours && (
              <div className="rounded-lg bg-green-50 border border-green-200 p-4 mb-6">
                <p className="text-sm text-green-800">Montant à payer : <span className="text-lg font-bold">{formatCurrency(Number(selectedConcours.fraisInscription))}</span></p>
              </div>
            )}
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Upload du quitus de paiement</h3>
              <p className="text-sm text-gray-600 mb-4">
                Effectuez votre paiement auprès de la banque ou via Mobile Money, puis uploadez le reçu / quitus ici.
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
                {quitus ? (
                  <div>
                    <FileText className="mx-auto h-10 w-10 text-green-500 mb-2" />
                    <p className="text-sm font-medium text-green-700">{quitus.name}</p>
                    <button onClick={() => setQuitus(null)} className="text-xs text-red-500 mt-2 hover:underline">Supprimer</button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Cliquez pour uploader votre quitus</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, JPG ou PNG — Max 5 Mo</p>
                    <input type="file" className="sr-only" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setQuitus(e.target.files?.[0] || null)} />
                  </label>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Summary */}
        {step === 6 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Récapitulatif</h2>
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Concours</h3>
                <p className="text-sm text-gray-600">{selectedConcours?.titre} — {selectedConcours?.departement}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Informations personnelles</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <p><span className="font-medium">Nom:</span> {form.nom} {form.prenom}</p>
                  <p><span className="font-medium">Né(e) le:</span> {form.dateNaissance}</p>
                  <p><span className="font-medium">Lieu:</span> {form.lieuNaissance}</p>
                  <p><span className="font-medium">Tél:</span> {form.telephone}</p>
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Parcours académique</h3>
                <p className="text-sm text-gray-600">{form.dernierDiplome} — {form.etablissement} ({form.anneeObtention})</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Documents uploadés</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {documents.filter(d => d.file).map(d => <li key={d.type}>✓ {d.file!.name}</li>)}
                  {quitus && <li>✓ Quitus: {quitus.name}</li>}
                </ul>
              </div>
              <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ En soumettant votre candidature, vous certifiez l&apos;exactitude des informations fournies.
                  Toute fausse déclaration entraînera l&apos;annulation de votre candidature.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)} className="btn-secondary flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" /> Précédent
            </button>
          ) : <div />}
          <button onClick={handleNext} disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : step === 6 ? 'Soumettre ma candidature' : <>Suivant <ChevronRight className="h-4 w-4" /></>}
          </button>
        </div>
      </div>
    </div>
  )
}
