import { prisma } from '@/lib/prisma'
import { FileText, Users, Trophy, CheckCircle } from 'lucide-react'
import {
  CANDIDATURE_STATUT_LABELS,
} from '@/lib/utils'

import { getCurrentUser } from '@/lib/auth'

import {
  Permission,
  hasPermission,
} from '@/lib/permissions'

import AdminPermissionNotice
  from '@/components/admin/AdminPermissionNotice'

export default async function AdminDashboard() {

  const user = await getCurrentUser()

  if (
    !user ||
    !hasPermission(
      user,
      Permission.MANAGE_USERS
    )
  ) {
    return (
      <AdminPermissionNotice title="Tableau de bord réservé">
        Cette vue globale est réservée au Super Admin.
      </AdminPermissionNotice>
    )
  }

  const [
    totalCandidatures,
    totalConcours,
    totalUsers,
    byStatus
  ] = await Promise.all([

    prisma.candidature.count(),

    prisma.concours.count(),

    prisma.user.count({
      where: {
        role: 'CANDIDAT'
      }
    }),

    prisma.candidature.groupBy({
      by: ['statut'],
      _count: true,
    }),
  ])

  const statusMap = Object.fromEntries(
    byStatus.map((s) => [
      s.statut,
      s._count
    ])
  )

  const stats = [
    {
      label: 'Candidatures',
      value: totalCandidatures,
      icon: FileText,
      color:
        'text-blue-600 bg-blue-50',
    },

    {
      label: 'Concours',
      value: totalConcours,
      icon: Trophy,
      color:
        'text-green-600 bg-green-50',
    },

    {
      label: 'Candidats',
      value: totalUsers,
      icon: Users,
      color:
        'text-purple-600 bg-purple-50',
    },

    {
      label: 'Validées',
      value:
        statusMap['VALIDEE'] || 0,
      icon: CheckCircle,
      color:
        'text-emerald-600 bg-emerald-50',
    },
  ]

  return (
    <div>

      {/* HEADER */}

      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Tableau de bord
          </h1>

          <p className="text-sm text-gray-500">
            Vue globale des candidatures et activités de la plateforme.
          </p>

        </div>

        <div className="rounded-2xl border border-green-100 bg-green-50 px-5 py-4 shadow-sm">

          <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
            Session active
          </p>

          <p className="mt-1 text-sm font-bold text-green-900">
            SUPER_ADMIN
          </p>

        </div>

      </div>

      {/* KPI */}

      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

        {stats.map((s, i) => (

          <div
            key={i}

            className={`
              group flex items-center gap-4
              rounded-2xl border border-gray-200
              bg-white p-6 shadow-sm
              transition-all
              hover:-translate-y-1
              hover:shadow-md
            `}
          >

            <div
              className={`
                flex h-14 w-14 items-center
                justify-center rounded-2xl
                ${s.color}
              `}
            >
              <s.icon className="h-7 w-7" />
            </div>

            <div>

              <p className="text-3xl font-bold text-gray-900">
                {s.value}
              </p>

              <p className="text-sm text-gray-500">
                {s.label}
              </p>

            </div>

          </div>

        ))}

      </div>

      {/* ALERTES WORKFLOW */}

      <div className="mb-8 grid gap-5 md:grid-cols-2">

        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6 shadow-sm">

          <p className="text-sm font-semibold text-yellow-800">
            Dossiers nécessitant une attention
          </p>

          <p className="mt-3 text-4xl font-bold text-yellow-900">
            {statusMap['COMPLEMENT_DEMANDE'] || 0}
          </p>

          <p className="mt-2 text-sm text-yellow-700">
            Compléments demandés en attente de réponse.
          </p>

        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">

          <p className="text-sm font-semibold text-blue-800">
            Dossiers en cours d&apos;examen
          </p>

          <p className="mt-3 text-4xl font-bold text-blue-900">
            {statusMap['EN_COURS_EXAMEN'] || 0}
          </p>

          <p className="mt-2 text-sm text-blue-700">
            Candidatures actuellement analysées.
          </p>

        </div>

      </div>

      {/* REPARTITION */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="mb-5 flex items-center justify-between">

          <div>

            <h2 className="text-lg font-semibold text-gray-900">
              Répartition des candidatures
            </h2>

            <p className="text-sm text-gray-500">
              Statistiques globales par statut.
            </p>

          </div>

        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

          {Object.entries(statusMap).map(
            ([statut, count]) => (

              <div
                key={statut}

                className="
                  rounded-xl border border-gray-100
                  bg-gray-50 p-4 text-center
                  transition
                  hover:bg-white
                  hover:shadow-sm
                "
              >

                <p className="text-2xl font-bold text-gray-900">
                  {count}
                </p>

                <p className="mt-1 text-xs font-medium text-gray-500">
                  {
                    CANDIDATURE_STATUT_LABELS[
                      statut
                    ] || statut
                  }
                </p>

              </div>

            )
          )}

        </div>

      </div>

    </div>
  )
}
