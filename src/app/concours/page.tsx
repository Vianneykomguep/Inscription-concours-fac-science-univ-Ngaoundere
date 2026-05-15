import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import type React from 'react'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowRight, Calendar, CheckCircle2, FileText, MapPin, Users } from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'
import { getConcoursApplyPath, getConcoursDetailPath } from '@/lib/concours-links'
import { STAB_TYPE_LABELS } from '@/lib/stab-config'

export default async function ConcoursListPage() {
  const user = await getCurrentUser()
  const concours = await prisma.concours.findMany({
    where: { isActive: true, statut: { in: ['PUBLIE', 'EN_COURS'] } },
    orderBy: [{ departement: 'asc' }, { dateCloture: 'asc' }],
  })

  const grouped = concours.reduce<Record<string, typeof concours>>((acc, item) => {
    acc[item.departement] = acc[item.departement] ?? []
    acc[item.departement].push(item)
    return acc
  }, {})

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header user={user} />
      <main className="flex-1">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-uni-green">Faculte des Sciences</p>
              <h1 className="mt-2 text-4xl font-bold text-slate-950">Concours ouverts aux candidatures</h1>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Les concours sont organises par departement. Choisissez votre niveau, verifiez les pieces demandees puis completez le formulaire correspondant.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {concours.length > 0 ? (
            <div className="space-y-10">
              {Object.entries(grouped).map(([departement, items]) => (
                <section key={departement} className="space-y-5">
                  <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Departement</p>
                      <h2 className="text-2xl font-bold text-slate-950">{departement}</h2>
                    </div>
                    <p className="text-sm font-medium text-slate-500">{items.length} niveau{items.length > 1 ? 'x' : ''} ouvert{items.length > 1 ? 's' : ''}</p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {items.map((item) => (
                      <article key={item.id} className="flex min-h-[390px] flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                        <div className="mb-5 flex items-start justify-between gap-4">
                          <span className={item.statut === 'EN_COURS' ? 'badge-info' : 'badge-success'}>
                            {item.statut === 'EN_COURS' ? 'En cours' : 'Ouvert'}
                          </span>
                          <span className="rounded-md bg-emerald-50 px-3 py-1 text-sm font-bold text-uni-green">
                            {formatCurrency(Number(item.fraisInscription))}
                          </span>
                        </div>

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{STAB_TYPE_LABELS[item.type]}</p>
                        <h3 className="mt-2 text-lg font-bold leading-6 text-slate-950">{item.titre}</h3>
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{item.description}</p>

                        <div className="mt-5 space-y-3 text-sm text-slate-600">
                          <Info icon={MapPin} text={item.centres.join(', ')} />
                          <Info icon={Calendar} text={`Cloture : ${formatDate(item.dateCloture)}`} />
                          <Info icon={Users} text={`${item.nombrePlaces} places`} />
                          <Info icon={FileText} text={`${item.piecesRequises.length} pieces demandees`} />
                        </div>

                        {item.filieres.length > 0 && (
                          <div className="mt-5 flex flex-wrap gap-2">
                            {item.filieres.slice(0, 3).map((filiere) => (
                              <span key={filiere} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{filiere}</span>
                            ))}
                            {item.filieres.length > 3 && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">+{item.filieres.length - 3}</span>}
                          </div>
                        )}

                        <div className="mt-auto flex gap-3 pt-6">
                          <Link href={getConcoursDetailPath(item.id)} className="btn-secondary flex-1">Details</Link>
                          <Link href={getConcoursApplyPath(item.type, item.id)} className="btn-primary flex-1">
                            Postuler <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-slate-300" />
              <h2 className="mt-4 text-xl font-semibold text-slate-900">Aucun concours ouvert</h2>
              <p className="mt-2 text-slate-600">Les prochains concours seront affiches ici des leur publication.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}

function Info({ icon: Icon, text }: { icon: React.ComponentType<{ className?: string }>; text: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-uni-green" />
      <span>{text}</span>
    </div>
  )
}
