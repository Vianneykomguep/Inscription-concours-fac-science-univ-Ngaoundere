import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDate, CANDIDATURE_STATUT_LABELS, CANDIDATURE_STATUT_COLORS } from '@/lib/utils'

export default async function AdminCandidaturesPage() {
  const candidatures = await prisma.candidature.findMany({
    include: { concours: { select: { titre: true } }, user: { select: { email: true, firstName: true, lastName: true } } },
    orderBy: { createdAt: 'desc' }, take: 100,
  })
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestion des candidatures</h1>
      <div className="rounded-xl border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b"><tr>
            <th className="text-left px-4 py-3 font-medium text-gray-500">N° Dossier</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Candidat</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Concours</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Statut</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Action</th>
          </tr></thead>
          <tbody className="divide-y">
            {candidatures.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs">{c.numeroDossier}</td>
                <td className="px-4 py-3">{c.user.firstName} {c.user.lastName}</td>
                <td className="px-4 py-3">{c.concours.titre}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <span className={CANDIDATURE_STATUT_COLORS[c.statut]}>{CANDIDATURE_STATUT_LABELS[c.statut]}</span>
                    {c.statut === 'SOUMISE' && c.commentaireAdmin?.includes('Complément fourni') && (
                      <span className="badge-warning">Complément reçu</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{formatDate(c.createdAt)}</td>
                <td className="px-4 py-3"><Link href={`/admin/candidatures/${c.id}`} className="text-blue-600 hover:underline">Examiner</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
