import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileText, Download } from 'lucide-react'
import { formatDate, CANDIDATURE_STATUT_LABELS, CANDIDATURE_STATUT_COLORS } from '@/lib/utils'
import AdminStatusActions from '@/components/admin/AdminStatusActions'

export default async function AdminCandidatureDetail({ params }: { params: { id: string } }) {
  const c = await prisma.candidature.findUnique({
    where: { id: params.id },
    include: { concours: true, user: { select: { email: true, firstName: true, lastName: true, phone: true } }, documents: true, uploadedDocuments: true, paiements: true },
  })
  if (!c) notFound()
  return (
    <div>
      <Link href="/admin/candidatures" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"><ArrowLeft className="h-4 w-4" /> Retour</Link>
      <div className="flex justify-between items-start mb-6">
        <div><h1 className="text-2xl font-bold">{c.nom} {c.prenom}</h1><p className="text-gray-500">N° {c.numeroDossier} — {c.concours.titre}</p></div>
        <span className={CANDIDATURE_STATUT_COLORS[c.statut]}>{CANDIDATURE_STATUT_LABELS[c.statut]}</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border bg-white p-6">
            <h3 className="font-semibold mb-3">Informations</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><span className="text-gray-500">Email:</span> {c.user.email}</p>
              <p><span className="text-gray-500">Tél:</span> {c.telephone || c.user.phone}</p>
              <p><span className="text-gray-500">Né(e):</span> {c.dateNaissance ? formatDate(c.dateNaissance) : '-'} à {c.lieuNaissance}</p>
              <p><span className="text-gray-500">Diplôme:</span> {c.dernierDiplome} ({c.etablissement})</p>
            </div>
          </div>
          <div className="rounded-xl border bg-white p-6">
            <h3 className="font-semibold mb-3">Documents ({c.documents.length + c.uploadedDocuments.length})</h3>
            <div className="space-y-2">
              {c.documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between border rounded-lg p-3">
                  <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-gray-400" /><span className="text-sm">{doc.nomFichier}</span><span className="text-xs text-gray-400">({doc.type})</span></div>
                  <a href={doc.url} target="_blank" className="text-blue-600 text-sm flex items-center gap-1"><Download className="h-3 w-3" />Ouvrir</a>
                </div>
              ))}
              {c.uploadedDocuments.map(doc => (
                <div key={doc.id} className="flex items-center justify-between border rounded-lg p-3">
                  <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-gray-400" /><span className="text-sm">{doc.type}</span><span className="text-xs text-gray-400">{doc.verified ? '(vérifié)' : '(en attente)'}</span></div>
                  <a href={doc.fileUrl} target="_blank" className="text-blue-600 text-sm flex items-center gap-1"><Download className="h-3 w-3" />Ouvrir</a>
                </div>
              ))}
            </div>
          </div>
        </div>
        <AdminStatusActions candidatureId={c.id} currentStatut={c.statut} />
      </div>
    </div>
  )
}
