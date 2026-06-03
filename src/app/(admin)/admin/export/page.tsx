import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { hasPermission, Permission } from '@/lib/permissions'
import AdminPermissionNotice from '@/components/admin/AdminPermissionNotice'
import { Download, FileSpreadsheet, ListChecks } from 'lucide-react'

const exports = [
  {
    kind: 'candidatures',
    title: 'Liste des etudiants inscrits',
    description: 'Identite, departement, niveau, filiere, centre, statut, documents et paiements.',
  },
  {
    kind: 'resultats',
    title: 'Resultats publies',
    description: 'Numero de dossier, candidat, concours, note, rang et decision finale.',
  },
  {
    kind: 'concours',
    title: 'Concours configures',
    description: 'Departements, niveaux, places, dates, statut et volume de candidatures.',
  },
]

export default async function AdminExportPage() {
  const user = await getCurrentUser()
  if (!user || !hasPermission(user, Permission.MANAGE_USERS)) {
    return (
      <AdminPermissionNotice title="Exportations reservees">
        Cette section necessite un compte Super Admin.
      </AdminPermissionNotice>
    )
  }

  const concours = await prisma.concours.findMany({
    orderBy: [{ departement: 'asc' }, { titre: 'asc' }],
    select: { id: true, titre: true, departement: true },
  })

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-uni-green">Pilotage administratif</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950">Exportations</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Exportez les donnees essentielles en Excel ou CSV pour les commissions, les archives et le suivi administratif.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {exports.map((item) => (
          <article key={item.kind} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-uni-green">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-950">{item.title}</h2>
            <p className="mt-2 min-h-[64px] text-sm leading-6 text-slate-600">{item.description}</p>
            <div className="mt-5 flex gap-3">
              <a href={`/api/admin/exportkind=${item.kind}&format=xlsx`} className="btn-primary flex-1">
                <Download className="mr-2 h-4 w-4" /> Excel
              </a>
              <a href={`/api/admin/exportkind=${item.kind}&format=csv`} className="btn-secondary flex-1">
                CSV
              </a>
            </div>
          </article>
        ))}
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <ListChecks className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-950">Export par concours</h2>
          <p className="text-sm text-slate-600">Telechargez directement la liste des inscrits d'un niveau precis.</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {concours.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.departement}</p>
                <p className="font-medium text-slate-900">{item.titre}</p>
              </div>
              <a href={`/api/admin/exportkind=candidatures&format=xlsx&concoursId=${item.id}`} className="btn-secondary shrink-0">
                Excel
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
