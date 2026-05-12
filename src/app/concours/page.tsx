import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import type React from 'react'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowRight, Calendar, CheckCircle2, FileText, MapPin, Users } from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'
import { getConcoursApplyPath, getConcoursDetailPath } from '@/lib/concours-links'

export default async function ConcoursListPage() {
  const user = await getCurrentUser()
  const concours = await prisma.concours.findMany({
    where: { isActive: true, statut: { in: ['PUBLIE', 'EN_COURS'] } },
    orderBy: { dateCloture: 'asc' },
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} />
      <main className="flex-1 bg-gray-50">
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-uni-green">Faculté des Sciences</p>
              <h1 className="mt-2 text-4xl font-bold text-gray-950">Concours ouverts aux candidatures</h1>
              <p className="mt-3 text-base text-gray-600">
                Choisissez le concours correspondant à votre niveau, consultez les pièces demandées, puis remplissez le formulaire STAB dédié.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {concours.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {concours.map((item) => (
                <article key={item.id} className="flex min-h-[360px] flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <span className={item.statut === 'EN_COURS' ? 'badge-info' : 'badge-success'}>
                      {item.statut === 'EN_COURS' ? 'En cours' : 'Inscriptions ouvertes'}
                    </span>
                    <span className="rounded-lg bg-green-50 px-3 py-1 text-sm font-bold text-uni-green">
                      {formatCurrency(Number(item.fraisInscription))}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-950">{item.titre}</h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">{item.description}</p>

                  <div className="mt-5 space-y-3 text-sm text-gray-600">
                    <Info icon={MapPin} text={item.departement} />
                    <Info icon={Calendar} text={`Clôture : ${formatDate(item.dateCloture)}`} />
                    <Info icon={Users} text={`${item.nombrePlaces} places`} />
                    <Info icon={FileText} text={`${item.piecesRequises.length} pièces demandées`} />
                  </div>

                  {item.filieres.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {item.filieres.slice(0, 3).map((filiere) => (
                        <span key={filiere} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">{filiere}</span>
                      ))}
                      {item.filieres.length > 3 && <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">+{item.filieres.length - 3}</span>}
                    </div>
                  )}

                  <div className="mt-auto flex gap-3 pt-6">
                    <Link href={getConcoursDetailPath(item.id)} className="btn-secondary flex-1">Détails</Link>
                    <Link href={getConcoursApplyPath(item.type, item.id)} className="btn-primary flex-1">
                      Postuler <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-gray-300" />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">Aucun concours ouvert</h2>
              <p className="mt-2 text-gray-600">Les prochains concours seront affichés ici dès leur publication.</p>
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
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-uni-green" />
      <span>{text}</span>
    </div>
  )
}
