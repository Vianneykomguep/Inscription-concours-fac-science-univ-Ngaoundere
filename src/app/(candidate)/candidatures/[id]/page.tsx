import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileText, Download, MessageSquare, Clock } from 'lucide-react'
import { formatDate, formatDateTime, CANDIDATURE_STATUT_LABELS, CANDIDATURE_STATUT_COLORS, formatCurrency } from '@/lib/utils'

export default async function CandidatureDetailPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const candidature = await prisma.candidature.findUnique({
    where: { id: params.id },
    include: {
      concours: true, documents: true, paiements: true,
      uploadedDocuments: true,
      messages: { include: { sender: { select: { firstName: true, lastName: true, role: true } } }, orderBy: { createdAt: 'asc' } },
    },
  })
  if (!candidature || candidature.userId !== user.id) notFound()

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-4 w-4" /> Retour au tableau de bord
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{candidature.concours.titre}</h1>
          <p className="text-gray-500">Dossier N° {candidature.numeroDossier}</p>
        </div>
        <span className={`${CANDIDATURE_STATUT_COLORS[candidature.statut]} text-sm`}>
          {CANDIDATURE_STATUT_LABELS[candidature.statut]}
        </span>
      </div>

      {candidature.motifRejet && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm font-medium text-red-800">Motif du rejet :</p>
          <p className="text-sm text-red-700 mt-1">{candidature.motifRejet}</p>
        </div>
      )}

      {candidature.complementInfo && (
        <div className="mb-6 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
          <p className="text-sm font-medium text-yellow-800">Complément demandé :</p>
          <p className="text-sm text-yellow-700 mt-1">{candidature.complementInfo}</p>
        </div>
      )}
      {candidature.statut === 'COMPLEMENT_DEMANDE' && (
  <div className="mb-6">
    <Link
      href={`/candidatures/${candidature.id}/edit`}
      className="btn-primary inline-flex"
    >
      Modifier ma candidature
    </Link>
  </div>
)}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Personal info */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Informations personnelles</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Nom :</span> <span className="font-medium">{candidature.nom} {candidature.prenom}</span></div>
              <div><span className="text-gray-500">Date de naissance :</span> <span className="font-medium">{candidature.dateNaissance ? formatDate(candidature.dateNaissance) : '-'}</span></div>
              <div><span className="text-gray-500">Lieu :</span> <span className="font-medium">{candidature.lieuNaissance || '-'}</span></div>
              <div><span className="text-gray-500">Sexe :</span> <span className="font-medium">{candidature.sexe === 'M' ? 'Masculin' : 'Féminin'}</span></div>
              <div><span className="text-gray-500">Nationalité :</span> <span className="font-medium">{candidature.nationalite}</span></div>
              <div><span className="text-gray-500">Téléphone :</span> <span className="font-medium">{candidature.telephone}</span></div>
            </div>
          </div>

          {/* Academic */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Parcours académique</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Diplôme :</span> <span className="font-medium">{candidature.dernierDiplome}</span></div>
              <div><span className="text-gray-500">Établissement :</span> <span className="font-medium">{candidature.etablissement}</span></div>
              <div><span className="text-gray-500">Année :</span> <span className="font-medium">{candidature.anneeObtention}</span></div>
              <div><span className="text-gray-500">Mention :</span> <span className="font-medium">{candidature.mention || '-'}</span></div>
            </div>
          </div>

          {/* Documents */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Documents</h3>
            <div className="space-y-3">
              {candidature.documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.nomFichier}</p>
                      <p className="text-xs text-gray-500">{doc.type} • {(doc.tailleFichier / 1024 / 1024).toFixed(2)} Mo</p>
                    </div>
                  </div>
                  <a href={doc.url} target="_blank" className="text-primary-600 hover:underline text-sm flex items-center gap-1">
                    <Download className="h-4 w-4" /> Voir
                  </a>
                </div>
              ))}
              {candidature.uploadedDocuments.map(doc => (
                <div key={doc.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.type}</p>
                      <p className="text-xs text-gray-500">{doc.verified ? 'Vérifié' : 'En attente de vérification'}</p>
                    </div>
                  </div>
                  <a href={doc.fileUrl} target="_blank" className="text-primary-600 hover:underline text-sm flex items-center gap-1">
                    <Download className="h-4 w-4" /> Voir
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Concours</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Département :</span> {candidature.concours.departement}</p>
              <p><span className="text-gray-500">Places :</span> {candidature.concours.nombrePlaces}</p>
              <p><span className="text-gray-500">Frais :</span> {formatCurrency(Number(candidature.concours.fraisInscription))}</p>
              <p><span className="text-gray-500">Clôture :</span> {formatDate(candidature.concours.dateCloture)}</p>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Historique</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Créé le</p>
                  <p className="text-gray-500">{formatDateTime(candidature.createdAt)}</p>
                </div>
              </div>
              {candidature.soumisLe && (
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-green-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Soumis le</p>
                    <p className="text-gray-500">{formatDateTime(candidature.soumisLe)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          {candidature.messages.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Messages
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {candidature.messages.map(msg => (
                  <div key={msg.id} className={`rounded-lg p-3 text-sm ${msg.senderRole === 'CANDIDAT' ? 'bg-primary-50' : 'bg-gray-100'}`}>
                    <p className="font-medium text-xs text-gray-500 mb-1">{msg.sender.firstName} {msg.sender.lastName}</p>
                    <p>{msg.contenu}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
