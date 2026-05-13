import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Calendar, MapPin, Users, FileText } from 'lucide-react'
import ConcoursActions from '@/components/admin/ConcoursActions'
import { getCurrentUser } from '@/lib/auth'
import { Permission, hasPermission } from '@/lib/permissions'
import AdminPermissionNotice from '@/components/admin/AdminPermissionNotice'

export default async function ConcoursDetailPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) return null
  if (!hasPermission(user, Permission.UPDATE_CONCOURS)) {
    return (
      <AdminPermissionNotice title="Détail concours réservé" badge="Niveau responsable">
        Cette section nécessite le rôle Responsable ou Super Admin.
      </AdminPermissionNotice>
    )
  }

  const concours = await prisma.concours.findUnique({
    where: { id: params.id },
    include: {
      _count: { select: { candidatures: true } },
    },
  })

  if (!concours) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-red-700">Concours non trouvé</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{concours.titre}</h1>
          <p className="mt-1 text-sm text-gray-600">{concours.departement}</p>
        </div>
        <Link href="/admin/concours" className="btn-secondary w-full text-center md:w-auto">
          Retour à la liste
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">Statut</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{concours.statut}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">Candidatures</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{concours._count.candidatures}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">Places disponibles</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{concours.nombrePlaces}</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Description</p>
            <p className="mt-1 text-gray-900">{concours.description}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Frais d'inscription</p>
            <p className="mt-1 text-lg font-semibold text-uni-green">{formatCurrency(Number(concours.fraisInscription))}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date d'ouverture</p>
            <p className="mt-1 text-gray-900">{formatDate(concours.dateOuverture)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date de clôture</p>
            <p className="mt-1 text-gray-900">{formatDate(concours.dateCloture)}</p>
          </div>
          {concours.dateConcours && (
            <div>
              <p className="text-sm text-gray-500">Date du concours</p>
              <p className="mt-1 text-gray-900">{formatDate(concours.dateConcours)}</p>
            </div>
          )}
          {concours.dateResultats && (
            <div>
              <p className="text-sm text-gray-500">Date des résultats</p>
              <p className="mt-1 text-gray-900">{formatDate(concours.dateResultats)}</p>
            </div>
          )}
          {concours.conditionsAdmission && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Conditions d'admission</p>
              <p className="mt-1 text-gray-900">{concours.conditionsAdmission}</p>
            </div>
          )}
          {concours.guideUrl && (
            <div>
              <p className="text-sm text-gray-500">Guide</p>
              <a href={concours.guideUrl} target="_blank" rel="noopener noreferrer" className="mt-1 text-blue-600 hover:underline">
                Télécharger le guide
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Actions</h2>
          <span className="badge-info">Niveau responsable requis</span>
        </div>
        <ConcoursActions concoursId={concours.id} currentStatus={concours.statut} userRole={user.role} />
      </div>
    </div>
  )
}
