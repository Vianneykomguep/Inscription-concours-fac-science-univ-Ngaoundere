import { prisma } from '@/lib/prisma'
import type React from 'react'
import { getCurrentUser } from '@/lib/auth'
import { hasPermission, Permission } from '@/lib/permissions'
import AdminPermissionNotice from '@/components/admin/AdminPermissionNotice'
import ResultDecisionForm from '@/components/admin/ResultDecisionForm'
import { CANDIDATURE_STATUT_LABELS, formatDate } from '@/lib/utils'
import { Award, Download, Medal, type LucideIcon } from 'lucide-react'

export default async function AdminResultatsPage() {
  const user = await getCurrentUser()
  if (!user || !hasPermission(user, Permission.PUBLISH_RESULTS)) {
    return (
      <AdminPermissionNotice title="Resultats reserves">
        La publication des resultats necessite un niveau responsable.
      </AdminPermissionNotice>
    )
  }

  const [resultats, candidatures] = await Promise.all([
    prisma.resultat.findMany({
      include: { concours: true },
      orderBy: [{ concours: { departement: 'asc' } }, { rang: 'asc' }, { createdAt: 'desc' }],
    }),
    prisma.candidature.findMany({
      where: { statut: { in: ['VALIDEE', 'ADMISSIBLE'] } },
      include: { concours: true },
      orderBy: [{ concours: { departement: 'asc' } }, { createdAt: 'desc' }],
    }),
  ])

  const alreadyPublished = new Set(resultats.map((item) => item.candidatureId).filter(Boolean))
  const pending = candidatures.filter((item) => !alreadyPublished.has(item.id))

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-uni-green">Deliberation</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-950">Resultats</h1>
            <p className="mt-2 text-sm text-slate-600">Publiez les decisions finales, notes et rangs, puis exportez les listes officielles.</p>
          </div>
          <a href="/api/admin/export?kind=resultats&format=xlsx" className="btn-primary">
            <Download className="mr-2 h-4 w-4" /> Exporter les resultats
          </a>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Metric label="Resultats publies" value={resultats.length} icon={Award} />
        <Metric label="Dossiers prets" value={pending.length} icon={Medal} />
        <Metric label="Admis" value={resultats.filter((item) => item.statutFinal === 'ADMIS').length} icon={Award} />
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Dossiers a publier</h2>
        <p className="mt-1 text-sm text-slate-600">Les candidatures validees ou admissibles peuvent recevoir une decision.</p>
        <div className="mt-5 space-y-3">
          {pending.length === 0 && <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">Aucun dossier en attente de publication.</p>}
          {pending.map((item) => (
            <div key={item.id} className="rounded-lg border border-slate-200 p-4">
              <div className="mb-3 grid gap-2 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="font-semibold text-slate-900">{item.nom} {item.prenom}</p>
                  <p className="text-xs text-slate-500">{item.numeroDossier} - {item.concours.departement} - {item.concours.titre}</p>
                </div>
                <span className="badge-info justify-self-start md:justify-self-end">{CANDIDATURE_STATUT_LABELS[item.statut]}</span>
              </div>
              <ResultDecisionForm candidatureId={item.id} />
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
          <h2 className="text-lg font-bold text-slate-950">Resultats publies</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-white text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Concours</th>
                <th className="px-4 py-3 font-medium">Dossier</th>
                <th className="px-4 py-3 font-medium">Candidat</th>
                <th className="px-4 py-3 font-medium">Decision</th>
                <th className="px-4 py-3 font-medium">Note</th>
                <th className="px-4 py-3 font-medium">Rang</th>
                <th className="px-4 py-3 font-medium">Publication</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {resultats.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{item.concours.titre}</p>
                    <p className="text-xs text-slate-500">{item.concours.departement}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{item.numeroDossier}</td>
                  <td className="px-4 py-3">{item.nomComplet}</td>
                  <td className="px-4 py-3"><span className={item.statutFinal === 'NON_ADMIS' ? 'badge-danger' : 'badge-success'}>{item.statutFinal}</span></td>
                  <td className="px-4 py-3">{item.note ? Number(item.note).toFixed(2) : '-'}</td>
                  <td className="px-4 py-3">{item.rang ?? '-'}</td>
                  <td className="px-4 py-3 text-slate-500">{item.publishedAt ? formatDate(item.publishedAt) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function Metric({ label, value, icon: Icon }: { label: string; value: number; icon: LucideIcon }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <Icon className="h-5 w-5 text-uni-green" />
      </div>
      <p className="mt-3 text-3xl font-bold text-slate-950">{value}</p>
    </div>
  )
}
