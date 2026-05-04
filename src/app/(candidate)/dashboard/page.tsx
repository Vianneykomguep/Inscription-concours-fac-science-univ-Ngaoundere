import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { FileText, Plus, Clock, CheckCircle, XCircle, AlertTriangle, Bell } from 'lucide-react'
import { formatDate, CANDIDATURE_STATUT_LABELS, CANDIDATURE_STATUT_COLORS, formatCurrency } from '@/lib/utils'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const [candidatures, notifications] = await Promise.all([
    prisma.candidature.findMany({
      where: { userId: user.id },
      include: { concours: { select: { titre: true, departement: true, fraisInscription: true } }, paiements: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.notification.findMany({
      where: { userId: user.id, lu: false },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  const stats = {
    total: candidatures.length,
    brouillon: candidatures.filter(c => c.statut === 'BROUILLON').length,
    enCours: candidatures.filter(c => ['SOUMISE', 'EN_COURS_EXAMEN'].includes(c.statut)).length,
    validees: candidatures.filter(c => ['VALIDEE', 'ADMISSIBLE', 'ADMIS'].includes(c.statut)).length,
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bonjour, {user.firstName} </h1>
          <p className="text-gray-600">Bienvenue dans votre espace candidat</p>
        </div>
        <Link href="/candidatures/new" className="btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nouvelle candidature
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: stats.total, icon: FileText, color: 'text-primary-600 bg-primary-50' },
          { label: 'Brouillons', value: stats.brouillon, icon: Clock, color: 'text-gray-600 bg-gray-100' },
          { label: 'En cours', value: stats.enCours, icon: AlertTriangle, color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Validées', value: stats.validees, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
        ].map((s, i) => (
          <div key={i} className="card flex items-center gap-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Notifications récentes</h3>
          </div>
          <div className="space-y-2">
            {notifications.map(n => (
              <div key={n.id} className="text-sm text-blue-800">
                <span className="font-medium">{n.titre}</span> — {n.contenu}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Candidatures */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Mes candidatures</h2>
      {candidatures.length > 0 ? (
        <div className="space-y-4">
          {candidatures.map(c => (
            <Link key={c.id} href={`/candidatures/${c.id}`} className="card block hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{c.concours.titre}</h3>
                  <p className="text-sm text-gray-500">{c.concours.departement} • N° {c.numeroDossier}</p>
                  <p className="text-xs text-gray-400 mt-1">Créé le {formatDate(c.createdAt)}</p>
                </div>
                <div className="text-right">
                  <span className={CANDIDATURE_STATUT_COLORS[c.statut]}>
                    {CANDIDATURE_STATUT_LABELS[c.statut]}
                  </span>
                  {c.statut === 'BROUILLON' && (
                    <p className="text-xs text-gray-400 mt-1">Étape {c.etapeActuelle}/6</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600">Aucune candidature pour le moment</p>
          <Link href="/candidatures/new" className="btn-primary mt-4 inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> Commencer une candidature
          </Link>
        </div>
      )}
    </div>
  )
}
