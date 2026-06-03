import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDate, formatCurrency } from '@/lib/utils'
import { getConcoursApplyPath, getConcoursDetailPath } from '@/lib/concours-links'
import { STAB_TYPE_LABELS, getDepartmentSortRank } from '@/lib/stab-config'

export default async function ConcoursListPage() {
  const user = await getCurrentUser()
  const concours = await prisma.concours.findMany({
    where: { isActive: true, statut: { in: ['PUBLIE', 'EN_COURS'] } },
    orderBy: [{ departement: 'asc' }, { dateCloture: 'asc' }],
  })

  const sortedConcours = [...concours].sort((a, b) => {
    const departmentRank = getDepartmentSortRank(a.departement) - getDepartmentSortRank(b.departement)
    if (departmentRank !== 0) return departmentRank
    return a.dateCloture.getTime() - b.dateCloture.getTime()
  })

  const grouped = sortedConcours.reduce<Record<string, typeof concours>>((acc, item) => {
    acc[item.departement] = acc[item.departement] ?? []
    acc[item.departement].push(item)
    return acc
  }, {})

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-emerald-950">
          <Image
            src="/assets/concours-hero.jpg"
            alt="Université de Ngaoundéré"
            fill
            priority
            className="object-cover opacity-35"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/90 to-emerald-900/40" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-amber-100 backdrop-blur">
                Faculté des Sciences
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white">Concours ouverts aux candidatures</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-emerald-50">
                Les concours sont organisés par département. Choisissez votre niveau, vérifiez les pièces demandées puis complétez le formulaire correspondant.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {concours.length > 0 ? (
            <div className="space-y-10">
              {Object.entries(grouped).map(([departement, items]) => (
                <section key={departement} className="space-y-5">
                  <div className="flex flex-col gap-3 border-b border-emerald-900/10 pb-4 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-uni-green">Département</p>
                      <h2 className="text-2xl font-bold text-slate-950">{departement}</h2>
                    </div>
                    <p className="rounded-full bg-amber-100 px-4 py-1.5 text-sm font-semibold text-amber-800">
                      {items.length} niveau{items.length > 1 ? 'x' : ''} ouvert{items.length > 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {items.map((item) => (
                      <article key={item.id} className="flex min-h-[390px] flex-col rounded-lg border border-emerald-900/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                        <div className="mb-5 flex items-start justify-between gap-4">
                          <span className={item.statut === 'EN_COURS' ? 'badge-info' : 'badge-success'}>
                            {item.statut === 'EN_COURS' ? 'En cours' : 'Ouvert'}
                          </span>
                          <span className="rounded-md bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">
                            {formatCurrency(Number(item.fraisInscription))}
                          </span>
                        </div>

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{STAB_TYPE_LABELS[item.type]}</p>
                        <h3 className="mt-2 text-lg font-bold leading-6 text-slate-950">{item.titre}</h3>
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{item.description}</p>

                        <div className="mt-5 space-y-3 text-sm text-slate-600">
                          <Info label="Centres" text={item.centres.join(', ')} />
                          <Info label="Clôture" text={formatDate(item.dateCloture)} />
                          <Info label="Places" text={`${item.nombrePlaces}`} />
                          <Info label="Pièces" text={`${item.piecesRequises.length} demandées`} />
                        </div>

                        {item.filieres.length > 0 && (
                          <div className="mt-5 flex flex-wrap gap-2">
                            {item.filieres.slice(0, 3).map((filiere) => (
                              <span key={filiere} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">{filiere}</span>
                            ))}
                            {item.filieres.length > 3 && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">+{item.filieres.length - 3}</span>}
                          </div>
                        )}

                        <div className="mt-auto flex gap-3 pt-6">
                          <Link href={getConcoursDetailPath(item.id)} className="btn-secondary flex-1">Détails</Link>
                          <Link href={getConcoursApplyPath(item.type, item.id)} className="btn-primary flex-1">
                            Postuler
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-emerald-900/10 bg-white p-12 text-center shadow-sm">
              <h2 className="mt-4 text-xl font-semibold text-slate-900">Aucun concours ouvert</h2>
              <p className="mt-2 text-slate-600">Les prochains concours seront affichés ici dès leur publication.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}

function Info({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <span className="font-semibold text-slate-900">{label} : </span>
      <span>{text}</span>
    </div>
  )
}
