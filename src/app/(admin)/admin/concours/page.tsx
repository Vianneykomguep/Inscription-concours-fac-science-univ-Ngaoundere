import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import ConcoursRowActions from '@/components/admin/ConcoursRowActions'

const STATUS_BADGES: Record<string, string> = {
  BROUILLON: 'badge-gray',
  PUBLIE: 'badge-success',
  EN_COURS: 'badge-info',
  CLOTURE: 'badge-warning',
  ARCHIVE: 'badge-gray',
}

export default async function AdminConcoursPage() {
  const concours = await prisma.concours.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Concours</h1>
          <p className="mt-1 text-sm text-gray-600">Consultez la liste des concours et créez-en un nouveau pour lancer les inscriptions.</p>
        </div>
        <Link href="/admin/concours/new" className="btn-primary w-full text-center md:w-auto">
          Créer un concours
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-500">Titre</th>
              <th className="px-4 py-3 font-medium text-gray-500">Département</th>
              <th className="px-4 py-3 font-medium text-gray-500">Places</th>
              <th className="px-4 py-3 font-medium text-gray-500">Ouverture</th>
              <th className="px-4 py-3 font-medium text-gray-500">Clôture</th>
              <th className="px-4 py-3 font-medium text-gray-500">Statut</th>
              <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {concours.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 font-semibold text-gray-900">{item.titre}</td>
                <td className="px-4 py-4 text-gray-600">{item.departement}</td>
                <td className="px-4 py-4 text-gray-600">{item.nombrePlaces}</td>
                <td className="px-4 py-4 text-gray-600">{formatDate(item.dateOuverture)}</td>
                <td className="px-4 py-4 text-gray-600">{formatDate(item.dateCloture)}</td>
                <td className="px-4 py-4">
                  <span className={STATUS_BADGES[item.statut] ?? 'badge-gray'}>{item.statut}</span>
                </td>
                <td className="px-4 py-4">
                  <ConcoursRowActions id={item.id} titre={item.titre} statut={item.statut} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

