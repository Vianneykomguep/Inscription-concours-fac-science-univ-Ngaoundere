import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import type React from 'react'
import { getCurrentUser } from '@/lib/auth'
import { getConcoursApplyPath } from '@/lib/concours-links'
import { hasDatabaseUrl, prisma } from '@/lib/prisma'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Download, FileText, MapPin, Users, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ConcoursDetailPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!hasDatabaseUrl) notFound()

  const concours = await prisma.concours.findUnique({
    where: { id: params.id },
    include: { documentsRequis: { orderBy: { ordre: 'asc' } }, _count: { select: { candidatures: true } } },
  }).catch((error) => {
    console.error('Concours detail error:', error)
    return null
  })

  if (!concours || !concours.isActive) notFound()

  const pieces = concours.piecesRequises.length > 0
    ? concours.piecesRequises
    : concours.documentsRequis.map((document) => document.nom)

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} />
      <main className="flex-1 bg-gray-50">
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <Link href="/concours" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-uni-green">
              <ArrowLeft className="h-4 w-4" /> Tous les concours
            </Link>
            <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
              <div>
                <span className={concours.statut === 'EN_COURS' ? 'badge-info' : 'badge-success'}>
                  {concours.statut === 'EN_COURS' ? 'En cours' : 'Inscriptions ouvertes'}
                </span>
                <h1 className="mt-4 text-4xl font-bold text-gray-950">{concours.titre}</h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600">{concours.description}</p>
              </div>

              <aside className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Frais d'inscription</p>
                <p className="mt-1 text-3xl font-bold text-uni-green">{formatCurrency(Number(concours.fraisInscription))}</p>
                <div className="mt-5 space-y-3 text-sm text-gray-700">
                  <Info icon={CalendarDays} label="Ouverture" value={formatDate(concours.dateOuverture)} />
                  <Info icon={CalendarDays} label="Clôture" value={formatDate(concours.dateCloture)} />
                  {concours.dateConcours && <Info icon={CalendarDays} label="Date concours" value={formatDate(concours.dateConcours)} />}
                  <Info icon={Users} label="Places" value={`${concours.nombrePlaces}`} />
                  <Info icon={MapPin} label="Département" value={concours.departement} />
                </div>
                <Link href={getConcoursApplyPath(concours.type, concours.id)} className="btn-primary mt-6 w-full">
                  Remplir le formulaire <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                {concours.guideUrl && (
                  <a
                    href={concours.guideUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary mt-3 flex w-full items-center justify-center"
                  >
                    Télécharger le guide
                  </a>
                )}
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-950">Filières</h2>
            <div className="mt-4 space-y-2">
              {concours.filieres.map((filiere) => (
                <Row key={filiere} text={filiere} />
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-950">Centres</h2>
            <div className="mt-4 space-y-2">
              {concours.centres.map((centre) => (
                <Row key={centre} text={centre} />
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-950">
              Pièces à fournir
            </h2>
            <div className="mt-4 space-y-2">
              {pieces.map((piece) => (
                <Row key={piece} text={piece} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function Info({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-uni-green" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  )
}

function Row({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-uni-green" />
      <span>{text}</span>
    </div>
  )
}


