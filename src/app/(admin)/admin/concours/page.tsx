import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import ConcoursRowActions from '@/components/admin/ConcoursRowActions'
import { getCurrentUser } from '@/lib/auth'
import { Permission, hasPermission } from '@/lib/permissions'
import AdminPermissionNotice from '@/components/admin/AdminPermissionNotice'

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
      <AdminPermissionNotice title="Gestion des concours réservée" badge="Niveau responsable">
        Cette section nécessite le rôle Responsable ou Super Admin.
      </AdminPermissionNotice>
    )
  }

  const concours = await prisma.concours.findMany({
    include: { _count: { select: { candidatures: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const canCreateConcours = hasPermission({ role: user.role }, Permission.CREATE_CONCOURS)

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Concours</h1>
          <p className="mt-1 text-sm text-gray-600">Créez, modifiez et activez les concours STAB publiés sur la plateforme.</p>
        </div>

        {canCreateConcours ? (
          <div className="flex flex-col items-stretch gap-2 md:items-end">
            <span className="badge-info self-start md:self-end">Niveau responsable</span>
            <Link href="/admin/concours/new" className="btn-primary w-full text-center md:w-auto">
              Créer un concours
            </Link>
          </div>
        ) : (
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            La création de concours nécessite un niveau responsable.
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-500">Concours</th>
              <th className="px-4 py-3 font-medium text-gray-500">Type</th>
              <th className="px-4 py-3 font-medium text-gray-500">Places</th>
              <th className="px-4 py-3 font-medium text-gray-500">Clôture</th>
              <th className="px-4 py-3 font-medium text-gray-500">Filières</th>
              <th className="px-4 py-3 font-medium text-gray-500">Candidatures</th>
              <th className="px-4 py-3 font-medium text-gray-500">Statut</th>
              <th className="px-4 py-3 font-medium text-gray-500">Actif</th>
              <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {concours.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <p className="font-semibold text-gray-900">{item.titre}</p>
                  <p className="text-xs text-gray-500">{item.departement}</p>
                </td>
                <td className="px-4 py-4 font-mono text-xs text-gray-600">{item.type}</td>
                <td className="px-4 py-4 text-gray-600">{item.nombrePlaces}</td>
                <td className="px-4 py-4 text-gray-600">{formatDate(item.dateCloture)}</td>
                <td className="px-4 py-4 text-gray-600">{item.filieres.length}</td>
                <td className="px-4 py-4 text-gray-600">{item._count.candidatures}</td>
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
    </div>
  )
}
