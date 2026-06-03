import type React from 'react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CANDIDATURE_STATUT_COLORS, CANDIDATURE_STATUT_LABELS, formatCurrency, formatDate, formatDateTime } from '@/lib/utils'
import { STAB_TYPE_LABELS } from '@/lib/stab-config'
import CandidatureMessageForm from '@/components/candidatures/CandidatureMessageForm'
import { getReceiptConfig } from '@/lib/receipts'

export default async function CandidatureDetailPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const candidature = await prisma.candidature.findUnique({
    where: { id: params.id },
    include: {
      concours: true,
      documents: true,
      paiements: true,
      uploadedDocuments: true,
      resultats: true,
      messages: {
        include: { sender: { select: { firstName: true, lastName: true, role: true } } },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!candidature || candidature.userId !== user.id) notFound()

  const result = candidature.resultats[0]
  const documentCount = candidature.documents.length + candidature.uploadedDocuments.length
  const receiptConfig = getReceiptConfig(candidature.type)

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-uni-green">
        Retour au tableau de bord
      </Link>

      <section className="overflow-hidden rounded-lg border border-emerald-900/10 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-emerald-950 to-emerald-800 px-6 py-7 text-white">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-200">
                {candidature.concours.departement} - {STAB_TYPE_LABELS[candidature.concours.type]}
              </p>
              <h1 className="mt-2 text-3xl font-bold">{candidature.concours.titre}</h1>
              <p className="mt-2 text-sm text-emerald-100">Dossier N° {candidature.numeroDossier}</p>
            </div>
            <span className={`${CANDIDATURE_STATUT_COLORS[candidature.statut]} self-start text-sm`}>
              {CANDIDATURE_STATUT_LABELS[candidature.statut]}
            </span>
          </div>
          {receiptConfig && (
            <a
              href={receiptConfig.url}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex rounded-md bg-uni-gold px-4 py-2 text-sm font-semibold text-emerald-950 hover:bg-amber-400"
            >
              Telecharger le recepisse PDF
            </a>
          )}
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-3">
          <Info label="Filière" value={candidature.filiere || '-'} />
          <Info label="Centre" value={candidature.centre || '-'} />
          <Info label="Documents" value={`${documentCount} pièce${documentCount > 1 ? 's' : ''}`} />
        </div>
      </section>

      {result && (
        <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
          <div className="flex items-start gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">Résultat publié</p>
              <h2 className="mt-1 text-2xl font-bold text-emerald-950">{result.statutFinal}</h2>
              <p className="mt-2 text-sm text-emerald-800">
                {result.note ? `Note : ${Number(result.note).toFixed(2)}. ` : ''}
                {result.rang ? `Rang : ${result.rang}. ` : ''}
                Publication : {result.publishedAt ? formatDate(result.publishedAt) : 'date non renseignee'}.
              </p>
            </div>
          </div>
        </section>
      )}

      {candidature.motifRejet && <Notice tone="red" title="Motif du rejet" text={candidature.motifRejet} />}
      {candidature.complementInfo && <Notice tone="yellow" title="Complément demandé" text={candidature.complementInfo} />}

      {candidature.statut === 'COMPLEMENT_DEMANDE' && (
        <Link href={`/candidatures/${candidature.id}/edit`} className="btn-primary inline-flex">
          Modifier ma candidature
        </Link>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Informations personnelles">
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <Info label="Nom complet" value={`${candidature.nom ?? ''} ${candidature.prenom ?? ''}`.trim() || '-'} />
              <Info label="Date de naissance" value={candidature.dateNaissance ? formatDate(candidature.dateNaissance) : '-'} />
              <Info label="Lieu de naissance" value={candidature.lieuNaissance || '-'} />
              <Info label="Sexe" value={candidature.sexe === 'M' ? 'Masculin' : candidature.sexe === 'F' ? 'Féminin' : '-'} />
              <Info label="Nationalité" value={candidature.nationalite || '-'} />
              <Info label="Téléphone" value={candidature.telephone || '-'} />
            </div>
          </Panel>

          <Panel title="Parcours académique">
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <Info label="Diplôme" value={candidature.dernierDiplome || '-'} />
              <Info label="Établissement" value={candidature.etablissement || '-'} />
              <Info label="Année" value={candidature.anneeObtention ? String(candidature.anneeObtention) : '-'} />
              <Info label="Mention" value={candidature.mention || '-'} />
            </div>
          </Panel>

          <Panel title={`Documents (${documentCount})`}>
            <div className="space-y-3">
              {candidature.documents.map((doc) => (
                <DocumentRow key={doc.id} label={doc.nomFichier} detail={`${doc.type} - ${(doc.tailleFichier / 1024 / 1024).toFixed(2)} Mo`} href={doc.url} />
              ))}
              {candidature.uploadedDocuments.map((doc) => (
                <DocumentRow key={doc.id} label={doc.type} detail={doc.verified ? 'Verifie' : 'En attente de verification'} href={doc.fileUrl} />
              ))}
              {documentCount === 0 && (
                <p className="text-sm italic text-slate-500">Aucun document n&apos;a été téléversé pour le moment.</p>
              )}
            </div>
          </Panel>

          <Panel title="Messages candidat/admin" id="messages">
          {candidature.messages.length > 0 ? (
              <div className="max-h-96 space-y-3 overflow-y-auto">
                {candidature.messages.map((msg) => (
                  <div key={msg.id} className={`rounded-lg p-3 text-sm ${msg.senderRole === 'CANDIDAT' ? 'bg-emerald-50' : 'bg-slate-100'}`}>
                    <div className="mb-1 flex items-center justify-between gap-3 text-xs text-slate-500">
                      <p className="font-semibold">{msg.sender.firstName} {msg.sender.lastName}</p>
                      <p className="shrink-0">{formatDateTime(msg.createdAt)}</p>
                    </div>
                    <p className="text-slate-700">{msg.contenu}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Aucun message n&apos;est associe a cette candidature.</p>
            )}
            <CandidatureMessageForm
              candidatureId={candidature.id}
              placeholder="Ecrivez un message a l'administration..."
            />
          </Panel>
        </div>

        <aside className="space-y-6">
          <Panel title="Concours">
            <div className="space-y-3 text-sm">
              <Info label="Département" value={candidature.concours.departement} />
              <Info label="Places" value={String(candidature.concours.nombrePlaces)} />
              <Info label="Frais" value={formatCurrency(Number(candidature.concours.fraisInscription))} />
              <Info label="Clôture" value={formatDate(candidature.concours.dateCloture)} />
            </div>
          </Panel>

          <Panel title="Historique">
            <div className="space-y-4">
              <Timeline label="Dossier créé" value={formatDateTime(candidature.createdAt)} />
              {candidature.soumisLe && <Timeline label="Dossier soumis" value={formatDateTime(candidature.soumisLe)} />}
              {candidature.validatedAt && <Timeline label="Dossier validé" value={formatDateTime(candidature.validatedAt)} />}
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  )
}

function Panel({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="scroll-mt-28 rounded-lg border border-emerald-900/10 bg-white p-6 shadow-sm">
      <h2 className="mb-4 font-bold text-slate-950">{title}</h2>
      {children}
    </section>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 px-3 py-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-slate-900">{value}</p>
    </div>
  )
}

function DocumentRow({ label, detail, href }: { label: string; detail: string; href: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{label}</p>
          <p className="text-xs text-slate-500">{detail}</p>
        </div>
      </div>
      <a href={href} target="_blank" rel="noreferrer" className="flex shrink-0 items-center gap-1 text-sm font-semibold text-uni-green hover:underline">
        Voir
      </a>
    </div>
  )
}

function Timeline({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-900">{label}</p>
      <p className="text-xs text-slate-500">{value}</p>
    </div>
  )
}

function Notice({ title, text, tone }: { title: string; text: string; tone: 'red' | 'yellow' }) {
  const classes = tone === 'red' ? 'border-red-200 bg-red-50 text-red-800' : 'border-yellow-200 bg-yellow-50 text-yellow-800'
  return (
    <div className={`rounded-lg border p-4 ${classes}`}>
      <p className="text-sm font-bold">{title}</p>
      <p className="mt-1 text-sm">{text}</p>
    </div>
  )
}
