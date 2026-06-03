import { prisma } from '@/lib/prisma'
import type React from 'react'
import { getCurrentUser } from '@/lib/auth'
import { hasPermission, Permission } from '@/lib/permissions'
import AdminPermissionNotice from '@/components/admin/AdminPermissionNotice'
import { CANDIDATURE_STATUT_LABELS } from '@/lib/utils'
import { BarChart3, Building2, CheckCircle2, FileText, GraduationCap, TrendingUp, Users, type LucideIcon } from 'lucide-react'

export default async function AdminStatsPage() {
  const user = await getCurrentUser()
  if (!user || !hasPermission(user, Permission.MANAGE_USERS)) {
    return (
      <AdminPermissionNotice title="Statistiques reservees">
        Cette section necessite un compte Super Admin.
      </AdminPermissionNotice>
    )
  }

  const [concours, candidatures, users] = await Promise.all([
    prisma.concours.findMany({ include: { _count: { select: { candidatures: true } } }, orderBy: { departement: 'asc' } }),
    prisma.candidature.findMany({ include: { concours: true }, orderBy: { createdAt: 'desc' } }),
    prisma.user.count({ where: { role: 'CANDIDAT' } }),
  ])

  const totalPlaces = concours.reduce((sum, item) => sum + item.nombrePlaces, 0)
  const admitted = candidatures.filter((item) => item.statut === 'ADMIS').length
  const validated = candidatures.filter((item) => ['VALIDEE', 'ADMISSIBLE', 'ADMIS'].includes(item.statut)).length
  const completionRate = candidatures.length ? Math.round((validated / candidatures.length) * 100) : 0
  const fillRate = totalPlaces ? Math.round((candidatures.length / totalPlaces) * 100) : 0

  const byDepartment = group(candidatures, (item) => item.concours.departement)
  const byStatus = group(candidatures, (item) => item.statut)
  const byCenter = group(candidatures, (item) => item.centre || 'Non renseigne')
  const byFiliere = group(candidatures, (item) => item.filiere || 'Non renseignee')

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-uni-green">Observatoire des concours</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950">Statistiques detaillees</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Suivez la pression par departement, la progression des dossiers, la repartition par centre et les taux d'occupation des places.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <Metric label="Candidatures" value={candidatures.length} icon={FileText} />
        <Metric label="Concours" value={concours.length} icon={GraduationCap} />
        <Metric label="Candidats" value={users} icon={Users} />
        <Metric label="Taux dossiers solides" value={`${completionRate}%`} icon={CheckCircle2} />
        <Metric label="Occupation places" value={`${fillRate}%`} icon={TrendingUp} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Departements" subtitle="Candidatures et capacite d'accueil">
          <div className="space-y-4">
            {Object.entries(byDepartment).map(([department, count]) => {
              const places = concours.filter((item) => item.departement === department).reduce((sum, item) => sum + item.nombrePlaces, 0)
              return <ProgressRow key={department} label={department} value={count} max={Math.max(places, count, 1)} detail={`${count}/${places} places`} />
            })}
          </div>
        </Panel>

        <Panel title="Statuts" subtitle="Avancement administratif">
          <div className="grid gap-3">
            {Object.entries(byStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">{CANDIDATURE_STATUT_LABELS[status] ?? status}</span>
                <span className="text-lg font-bold text-slate-950">{count}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Centres de concours" subtitle="Repartition geographique des candidats">
          <div className="space-y-3">
            {topEntries(byCenter).map(([center, count]) => (
              <ProgressRow key={center} label={center} value={count} max={Math.max(candidatures.length, 1)} detail={`${count} dossiers`} />
            ))}
          </div>
        </Panel>

        <Panel title="Filieres demandees" subtitle="Top des choix candidats">
          <div className="space-y-3">
            {topEntries(byFiliere).map(([filiere, count]) => (
              <ProgressRow key={filiere} label={filiere} value={count} max={Math.max(candidatures.length, 1)} detail={`${count} dossiers`} />
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Performance par concours" subtitle="Vue operationnelle pour les commissions">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Departement</th>
                <th className="px-4 py-3 font-medium">Concours</th>
                <th className="px-4 py-3 font-medium">Places</th>
                <th className="px-4 py-3 font-medium">Dossiers</th>
                <th className="px-4 py-3 font-medium">Admis</th>
                <th className="px-4 py-3 font-medium">Occupation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {concours.map((item) => {
                const related = candidatures.filter((candidate) => candidate.concoursId === item.id)
              const occupation = item.nombrePlaces ? Math.round((related.length / item.nombrePlaces) * 100) : 0
                return (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">{item.departement}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{item.titre}</td>
                    <td className="px-4 py-3">{item.nombrePlaces}</td>
                    <td className="px-4 py-3">{related.length}</td>
                    <td className="px-4 py-3">{related.filter((candidate) => candidate.statut === 'ADMIS').length}</td>
                    <td className="px-4 py-3">{occupation}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid gap-5 md:grid-cols-3">
        <Insight icon={Building2} label="Departement dominant" value={bestLabel(byDepartment)} />
        <Insight icon={BarChart3} label="Centre le plus sollicite" value={bestLabel(byCenter)} />
        <Insight icon={CheckCircle2} label="Admis publies" value={String(admitted)} />
      </div>
    </div>
  )
}

function group<T>(items: T[], getKey: (item: T) => string) {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = getKey(item)
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {})
}

function topEntries(items: Record<string, number>) {
  return Object.entries(items).sort((a, b) => b[1] - a[1]).slice(0, 8)
}

function bestLabel(items: Record<string, number>) {
  return topEntries(items)[0]?.[0] ?? 'Aucune donnee'
}

function Metric({ label, value, icon: Icon }: { label: string; value: number | string; icon: LucideIcon }) {
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

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      {children}
    </section>
  )
}

function ProgressRow({ label, value, max, detail }: { label: string; value: number; max: number; detail: string }) {
  const percent = Math.min(100, Math.round((value / max) * 100))
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="truncate text-sm font-medium text-slate-700">{label}</p>
        <p className="shrink-0 text-xs font-semibold text-slate-500">{detail}</p>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-uni-green" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

function Insight({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <Icon className="h-5 w-5 text-uni-green" />
      <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-950">{value}</p>
    </div>
  )
}
