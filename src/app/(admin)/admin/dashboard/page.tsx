import { prisma } from '@/lib/prisma'
import { FileText, Users, Trophy, CheckCircle } from 'lucide-react'
import { CANDIDATURE_STATUT_LABELS } from '@/lib/utils'

export default async function AdminDashboard() {
  const [totalCandidatures, totalConcours, totalUsers, byStatus] = await Promise.all([
    prisma.candidature.count(), prisma.concours.count(),
    prisma.user.count({ where: { role: 'CANDIDAT' } }),
    prisma.candidature.groupBy({ by: ['statut'], _count: true }),
  ])
  const statusMap = Object.fromEntries(byStatus.map(s => [s.statut, s._count]))
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Tableau de bord</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Candidatures', value: totalCandidatures, icon: FileText, color: 'text-blue-600 bg-blue-50' },
          { label: 'Concours', value: totalConcours, icon: Trophy, color: 'text-green-600 bg-green-50' },
          { label: 'Candidats', value: totalUsers, icon: Users, color: 'text-purple-600 bg-purple-50' },
          { label: 'Validées', value: statusMap['VALIDEE'] || 0, icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
        ].map((s, i) => (
          <div key={i} className="rounded-xl border bg-white p-6 flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.color}`}><s.icon className="h-6 w-6" /></div>
            <div><p className="text-2xl font-bold">{s.value}</p><p className="text-sm text-gray-500">{s.label}</p></div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border bg-white p-6">
        <h2 className="font-semibold mb-4">Répartition par statut</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(statusMap).map(([statut, count]) => (
            <div key={statut} className="text-center p-3 rounded-lg bg-gray-50">
              <p className="text-xl font-bold">{count}</p>
              <p className="text-xs text-gray-500">{CANDIDATURE_STATUT_LABELS[statut] || statut}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
