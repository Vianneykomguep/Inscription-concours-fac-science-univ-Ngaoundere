import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { AlertTriangle, Bell, Clock, FileText, GraduationCap, Plus, Trophy, type LucideIcon } from 'lucide-react'
import { formatDate, CANDIDATURE_STATUT_LABELS, CANDIDATURE_STATUT_COLORS, formatCurrency } from '@/lib/utils'
import { STAB_TYPE_LABELS } from '@/lib/stab-config'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const [candidatures, notifications, concoursOuverts] = await Promise.all([
    prisma.candidature.findMany({
      where: { userId: user.id },
      include: {
        concours: { select: { titre: true, departement: true, fraisInscription: true, type: true, dateCloture: true } },
        paiements: true,
        documents: true,
        uploadedDocuments: true,
        resultats: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.notification.findMany({
      where: { userId: user.id, lu: false },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.concours.count({
      where: { isActive: true, statut: { in: ['PUBLIE', 'EN_COURS'] } },
    }),
  ])

  const stats = {
    total: candidatures.length,
    aCompleter: candidatures.filter((c) => ['BROUILLON', 'COMPLEMENT_DEMANDE'].includes(c.statut)).length,
    enCours: candidatures.filter((c) => ['SOUMISE', 'EN_COURS_EXAMEN'].includes(c.statut)).length,
    resultats: candidatures.filter((c) => ['ADMISSIBLE', 'ADMIS', 'NON_ADMIS'].includes(c.statut)).length,
  }

  const nextAction = candidatures.find((item) => item.statut === 'COMPLEMENT_DEMANDE') ?? candidatures.find((item) => item.statut === 'BROUILLON')

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-8 p-6 lg:grid-cols-[1fr_340px] lg:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-uni-green">Espace candidat</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Bonjour, {user.firstName}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Suivez vos dossiers, les pieces deposees, les paiements et les resultats publies par la Faculte des Sciences.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/concours" className="btn-primary">
                <Plus className="mr-2 h-4 w-4" /> Nouvelle candidature
              </Link>
              <Link href="/concours" className="btn-secondary">
                {concoursOuverts} concours ouverts
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-5">
            <p className="text-sm font-semibold text-emerald-900">Prochaine action</p>
        {nextAction ? (
              <div className="mt-3">
                <p className="font-bold text-emerald-950">{nextAction.concours.titre}</p>
                <p className="mt-1 text-sm text-emerald-800">
                  {nextAction.statut === 'COMPLEMENT_DEMANDE' ? 'Un complement est attendu pour poursuivre le traitement.' : 'Votre dossier est encore en brouillon.'}
                </p>
                <Link href={`/candidatures/${nextAction.id}`} className="btn-primary mt-4 bg-emerald-700 hover:bg-emerald-800">
                  Ouvrir le dossier
                </Link>
              </div>
            ) : (
              <p className="mt-3 text-sm text-emerald-800">Aucune action urgente. Les dossiers soumis sont en suivi administratif.</p>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Metric label="Total dossiers" value={stats.total} icon={FileText} tone="blue" />
        <Metric label="A completer" value={stats.aCompleter} icon={Clock} tone="slate" />
        <Metric label="En examen" value={stats.enCours} icon={AlertTriangle} tone="amber" />
        <Metric label="Resultats" value={stats.resultats} icon={Trophy} tone="green" />
      </section>

      {notifications.length > 0 && (
        <section className="rounded-lg border border-blue-200 bg-blue-50 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-700" />
            <h2 className="font-bold text-blue-950">Notifications recentes</h2>
          </div>
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div key={notification.id} className="rounded-md bg-white/70 px-4 py-3 text-sm text-blue-900">
                <span className="font-semibold">{notification.titre}</span> - {notification.contenu}
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Mes candidatures</h2>
            <p className="text-sm text-slate-500">Chaque carte resume l'etat administratif du dossier.</p>
          </div>
        </div>

        {candidatures.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {candidatures.map((candidature) => {
              const documentCount = candidature.documents.length + candidature.uploadedDocuments.length
              const result = candidature.resultats[0]

              return (
                <Link key={candidature.id} href={`/candidatures/${candidature.id}`} className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{candidature.concours.departement} - {STAB_TYPE_LABELS[candidature.concours.type]}</p>
                      <h3 className="mt-2 font-bold leading-6 text-slate-950 group-hover:text-uni-green">{candidature.concours.titre}</h3>
                      <p className="mt-1 text-sm text-slate-500">Dossier {candidature.numeroDossier}</p>
                    </div>
                    <span className={CANDIDATURE_STATUT_COLORS[candidature.statut]}>
                      {CANDIDATURE_STATUT_LABELS[candidature.statut]}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <Info label="Filiere" value={candidature.filiere || '-'} />
                    <Info label="Centre" value={candidature.centre || '-'} />
                    <Info label="Documents" value={`${documentCount} piece${documentCount > 1 ? 's' : ''}`} />
                    <Info label="Frais" value={formatCurrency(Number(candidature.concours.fraisInscription))} />
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <p className="text-xs text-slate-500">Cree le {formatDate(candidature.createdAt)} - Cloture {formatDate(candidature.concours.dateCloture)}</p>
                    {result ? (
                      <span className={result.statutFinal === 'NON_ADMIS' ? 'badge-danger' : 'badge-success'}>{result.statutFinal}</span>
                    ) : (
                      <span className="text-sm font-semibold text-uni-green">Consulter</span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white py-14 text-center shadow-sm">
            <GraduationCap className="mx-auto mb-4 h-12 w-12 text-slate-300" />
            <p className="font-semibold text-slate-900">Aucune candidature pour le moment</p>
            <p className="mt-1 text-sm text-slate-500">Choisissez un concours ouvert pour demarrer votre dossier.</p>
            <Link href="/concours" className="btn-primary mt-5 inline-flex">
              <Plus className="mr-2 h-4 w-4" /> Commencer
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}

function Metric({ label, value, icon: Icon, tone }: { label: string; value: number; icon: LucideIcon; tone: 'blue' | 'slate' | 'amber' | 'green' }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-700',
    slate: 'bg-slate-100 text-slate-700',
    amber: 'bg-amber-50 text-amber-700',
    green: 'bg-emerald-50 text-emerald-700',
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-950">{value}</p>
          <p className="text-sm text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 px-3 py-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 truncate font-medium text-slate-900">{value}</p>
    </div>
  )
}
