import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import ConcoursRowActions from '@/components/admin/ConcoursRowActions'
import { getCurrentUser } from '@/lib/auth'
import { Permission, hasPermission } from '@/lib/permissions'
import AdminPermissionNotice from '@/components/admin/AdminPermissionNotice'
import { STAB_TYPE_LABELS } from '@/lib/stab-config'

const STATUS_BADGES: Record<string, string> = {
  BROUILLON: 'badge-gray',
  PUBLIE: 'badge-success',
  EN_COURS: 'badge-info',
  CLOTURE: 'badge-warning',
  ARCHIVE: 'badge-gray',
}

export default async function AdminConcoursPage() {
  const user = await getCurrentUser()
  if (!user) return null
  if (!hasPermission(user, Permission.UPDATE_CONCOURS)) {
    return (
      <AdminPermissionNotice title="Gestion des concours reservee" badge="Niveau responsable">
        Cette section necessite le role Responsable ou Super Admin.
      </AdminPermissionNotice>
    )
  }

  const concours = await prisma.concours.findMany({
    include: { _count: { select: { candidatures: true } } },
    orderBy: [{ departement: 'asc' }, { createdAt: 'desc' }],
  })

  const grouped = concours.reduce<Record<string, typeof concours>>((acc, item) => {
    acc[item.departement] = acc[item.departement] ?? []
    acc[item.departement].push(item)
    return acc
  }, {})

  const canCreateConcours = hasPermission({ role: user.role }, Permission.CREATE_CONCOURS)

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-uni-green">Administration academique</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950">Concours par departement</h1>
          <p className="mt-1 text-sm text-slate-600">Pilotez les niveaux ouverts, les places, les dates et les pieces attendues.</p>
        </div>

        {canCreateConcours ? (
          <div className="flex flex-col items-stretch gap-2 md:items-end">
            <span className="badge-info self-start md:self-end">Niveau responsable</span>
            <Link href="/admin/concours/new" className="btn-primary w-full text-center md:w-auto">
              Creer un concours
            </Link>
          </div>
        ) : (
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            La creation de concours necessite un niveau responsable.
          </div>
        )}
      </div>

      {Object.entries(grouped).map(([departement, items]) => (
        <section key={departement} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Departement</p>
                <h2 className="text-lg font-bold text-slate-950">{departement}</h2>
              </div>
              <p className="text-sm font-medium text-slate-500">{items.length} concours configures</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-white">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-500">Concours</th>
                  <th className="px-4 py-3 font-medium text-slate-500">Niveau</th>
                  <th className="px-4 py-3 font-medium text-slate-500">Places</th>
                  <th className="px-4 py-3 font-medium text-slate-500">Cloture</th>
                  <th className="px-4 py-3 font-medium text-slate-500">Filieres</th>
                  <th className="px-4 py-3 font-medium text-slate-500">Candidatures</th>
                  <th className="px-4 py-3 font-medium text-slate-500">Statut</th>
                  <th className="px-4 py-3 font-medium text-slate-500">Actif</th>
                  <th className="px-4 py-3 font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-900">{item.titre}</p>
                      <p className="text-xs text-slate-500">{item.centres.join(', ')}</p>
                    </td>
                    <td className="px-4 py-4 text-xs font-medium text-slate-600">{STAB_TYPE_LABELS[item.type]}</td>
                    <td className="px-4 py-4 text-slate-600">{item.nombrePlaces}</td>
                    <td className="px-4 py-4 text-slate-600">{formatDate(item.dateCloture)}</td>
                    <td className="px-4 py-4 text-slate-600">{item.filieres.length}</td>
                    <td className="px-4 py-4 text-slate-600">{item._count.candidatures}</td>
                    <td className="px-4 py-4">
                      <span className={STATUS_BADGES[item.statut] ?? 'badge-gray'}>{item.statut}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={item.isActive ? 'badge-success' : 'badge-gray'}>{item.isActive ? 'Oui' : 'Non'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <ConcoursRowActions id={item.id} titre={item.titre} statut={item.statut} userRole={user.role} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  )
}
