import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, FileText } from 'lucide-react'
import ComplementResponseForm from './ComplementResponseForm'

export default async function EditCandidatureComplementPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const candidature = await prisma.candidature.findUnique({
    where: { id: params.id },
    include: {
      concours: { select: { titre: true } },
      documents: true,
      uploadedDocuments: true,
    },
  })

  if (!candidature || candidature.userId !== user.id) notFound()
  if (candidature.statut !== 'COMPLEMENT_DEMANDE') redirect(`/candidatures/${candidature.id}`)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link href={`/candidatures/${candidature.id}`} className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" />
        Retour au dossier
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Répondre à une demande de complément</h1>
        <p className="mt-1 text-sm text-gray-600">{candidature.concours.titre} • Dossier N° {candidature.numeroDossier}</p>
      </div>

      <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <p className="text-sm font-semibold text-yellow-900">Complément demandé</p>
        <p className="mt-1 text-sm text-yellow-800">{candidature.complementInfo}</p>
      </div>

      <div className="mb-6 card">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Documents existants</h2>
        {candidature.documents.length === 0 && candidature.uploadedDocuments.length === 0 ? (
          <p className="text-sm text-gray-500">Aucun document n'a encore été enregistré pour cette candidature.</p>
        ) : (
          <div className="space-y-3">
            {candidature.documents.map((document) => (
              <DocumentLink
                key={document.id}
                label={document.nomFichier}
                detail={`${document.type} • ${(document.tailleFichier / 1024 / 1024).toFixed(2)} Mo`}
                href={document.url}
              />
            ))}
            {candidature.uploadedDocuments.map((document) => (
              <DocumentLink
                key={document.id}
                label={document.type}
                detail={document.verified ? 'Vérifié' : 'En attente de vérification'}
                href={document.fileUrl}
              />
            ))}
          </div>
        )}
      </div>

      <ComplementResponseForm candidatureId={candidature.id} />
    </div>
  )
}

function DocumentLink({ label, detail, href }: { label: string; detail: string; href: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-3">
      <div className="flex min-w-0 items-center gap-3">
        <FileText className="h-5 w-5 shrink-0 text-gray-400" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">{label}</p>
          <p className="text-xs text-gray-500">{detail}</p>
        </div>
      </div>
      <a href={href} target="_blank" className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary-600 hover:underline">
        <Download className="h-4 w-4" />
        Voir
      </a>
    </div>
  )
}
