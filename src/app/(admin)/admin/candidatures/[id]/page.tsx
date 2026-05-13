import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, FileText, MessageSquare } from 'lucide-react'
import { formatDate, formatDateTime, CANDIDATURE_STATUT_LABELS, CANDIDATURE_STATUT_COLORS } from '@/lib/utils'
import AdminStatusActions from '@/components/admin/AdminStatusActions'
import { getCurrentUser } from '@/lib/auth'
import { Permission, hasPermission } from '@/lib/permissions'
import AdminPermissionNotice from '@/components/admin/AdminPermissionNotice'

export default async function AdminCandidatureDetail({ params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) notFound()
  if (!hasPermission(user, Permission.VIEW_CANDIDATURES)) {
    return (
      <AdminPermissionNotice title="Consultation de candidature réservée">
        Vous n'avez pas la permission de consulter cette candidature.
      </AdminPermissionNotice>
    )
  }

  const candidature = await prisma.candidature.findUnique({
    where: { id: params.id },
    include: {
      concours: true,
      user: { select: { email: true, firstName: true, lastName: true, phone: true } },
      documents: true,
      uploadedDocuments: { orderBy: { createdAt: 'desc' } },
      paiements: true,
      messages: {
        include: { sender: { select: { firstName: true, lastName: true, role: true } } },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!candidature) notFound()

  const complementReceived =
    candidature.statut === 'SOUMISE' &&
    Boolean(candidature.commentaireAdmin?.includes('Complément fourni'))

  return (
    <div>
      <Link href="/admin/candidatures" className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Link>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{candidature.nom} {candidature.prenom}</h1>
          <p className="text-gray-500">N° {candidature.numeroDossier} — {candidature.concours.titre}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={CANDIDATURE_STATUT_COLORS[candidature.statut]}>
            {CANDIDATURE_STATUT_LABELS[candidature.statut]}
          </span>
          {complementReceived && <span className="badge-warning">Complément reçu</span>}
        </div>
      </div>

      {complementReceived && (
        <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm font-semibold text-yellow-900">Complément reçu</p>
          <p className="mt-1 text-sm text-yellow-800">
            Le candidat a répondu à la demande de complément. Le dossier est repassé en statut soumis et attend une nouvelle revue.
          </p>
          {candidature.commentaireAdmin && (
            <p className="mt-2 text-xs font-medium text-yellow-700">{candidature.commentaireAdmin}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border bg-white p-6">
            <h3 className="mb-3 font-semibold">Informations</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><span className="text-gray-500">Email :</span> {candidature.user.email}</p>
              <p><span className="text-gray-500">Tél :</span> {candidature.telephone || candidature.user.phone}</p>
              <p>
                <span className="text-gray-500">Né(e) :</span>{' '}
                {candidature.dateNaissance ? formatDate(candidature.dateNaissance) : '-'} à {candidature.lieuNaissance}
              </p>
              <p><span className="text-gray-500">Diplôme :</span> {candidature.dernierDiplome} ({candidature.etablissement})</p>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <h3 className="mb-3 font-semibold">Documents ({candidature.documents.length + candidature.uploadedDocuments.length})</h3>
            <div className="space-y-2">
              {candidature.documents.map((document) => (
                <DocumentRow
                  key={document.id}
                  label={document.nomFichier}
                  detail={document.type}
                  href={document.url}
                />
              ))}

              {candidature.uploadedDocuments.map((document) => {
                const isComplementDocument = complementReceived && document.type === 'complement'

                return (
                  <DocumentRow
                    key={document.id}
                    label={document.type}
                    detail={document.verified ? 'Vérifié' : 'En attente'}
                    href={document.fileUrl}
                    highlighted={isComplementDocument}
                    badge={isComplementDocument ? 'Nouveau complément' : undefined}
                  />
                )
              })}
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold">
              <MessageSquare className="h-4 w-4 text-gray-500" />
              Messages candidat/admin
            </h3>
            {candidature.messages.length > 0 ? (
              <div className="space-y-3">
                {candidature.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`rounded-lg p-3 text-sm ${
                      message.senderRole === 'CANDIDAT'
                        ? 'border border-blue-100 bg-blue-50'
                        : 'border border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <p className="font-medium text-gray-900">
                        {message.sender.firstName} {message.sender.lastName}
                        <span className="ml-2 text-xs font-normal text-gray-500">{message.senderRole}</span>
                      </p>
                      <p className="shrink-0 text-xs text-gray-400">{formatDateTime(message.createdAt)}</p>
                    </div>
                    <p className="text-gray-700">{message.contenu}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Aucun message n'est associé à cette candidature.</p>
            )}
          </div>
        </div>

        <AdminStatusActions candidatureId={candidature.id} currentStatut={candidature.statut} userRole={user.role} />
      </div>
    </div>
  )
}

function DocumentRow({
  label,
  detail,
  href,
  highlighted = false,
  badge,
}: {
  label: string
  detail: string
  href: string
  highlighted?: boolean
  badge?: string
}) {
  return (
    <div className={`flex items-center justify-between rounded-lg border p-3 ${
      highlighted ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
    }`}>
      <div className="flex min-w-0 items-center gap-2">
        <FileText className={`h-4 w-4 shrink-0 ${highlighted ? 'text-yellow-600' : 'text-gray-400'}`} />
        <span className="truncate text-sm">{label}</span>
        <span className="shrink-0 text-xs text-gray-400">({detail})</span>
        {badge && <span className="badge-warning shrink-0">{badge}</span>}
      </div>
      <a href={href} target="_blank" className="flex shrink-0 items-center gap-1 text-sm text-blue-600 hover:underline">
        <Download className="h-3 w-3" />
        Ouvrir
      </a>
    </div>
  )
}
