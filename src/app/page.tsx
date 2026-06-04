export const dynamic = 'force-dynamic'

import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getCurrentUser } from '@/lib/auth'
import { hasDatabaseUrl, prisma } from '@/lib/prisma'
import { formatCurrency, formatDate } from '@/lib/utils'
import { getConcoursApplyPath, getConcoursDetailPath } from '@/lib/concours-links'
import { canAccessAdmin } from '@/lib/permissions'
import { getDepartmentSortRank } from '@/lib/stab-config'

const stats = [
  { value: '10+', label: 'Concours par an', tone: 'bg-emerald-950 text-white' },
  { value: '5000+', label: 'Candidats inscrits', tone: 'bg-emerald-950 text-white' },
  { value: '100%', label: 'Dématérialisé', tone: 'bg-emerald-950 text-white' },
  { value: '24/7', label: 'Disponible', tone: 'bg-emerald-950 text-white' },
]

const steps = [
  { step: '1', title: 'Créez votre compte', desc: 'Inscrivez-vous avec votre email et vérifiez votre adresse.' },
  { step: '2', title: 'Choisissez un concours', desc: 'Parcourez les concours disponibles et sélectionnez le vôtre.' },
  { step: '3', title: 'Remplissez le dossier', desc: 'Complétez le formulaire et téléversez vos documents.' },
  { step: '4', title: 'Payez et soumettez', desc: 'Uploadez votre quitus de paiement et soumettez votre dossier.' },
]

export default async function HomePage() {
  const user = await getCurrentUser()
  const isAdminUser = user ? canAccessAdmin(user) : false
  const concours = (hasDatabaseUrl ? await prisma.concours.findMany({
    where: { statut: 'PUBLIE' },
    orderBy: { dateCloture: 'asc' },
  }).catch((error) => {
    console.error('Home concours error:', error)
    return []
  }) : []).sort((a, b) => {
    const departmentRank = getDepartmentSortRank(a.departement) - getDepartmentSortRank(b.departement)
    if (departmentRank !== 0) return departmentRank
    return a.dateCloture.getTime() - b.dateCloture.getTime()
  }).slice(0, 6)

  const heroTitle = !user ? (
    <>
      Inscrivez-vous aux <span className="text-uni-gold">concours</span> en ligne
    </>
  ) : isAdminUser ? (
    <>
      Espace <span className="text-uni-gold">Administration</span>
    </>
  ) : (
    <>
      Bonjour <span className="text-uni-gold">{user.firstName}</span>
    </>
  )

  const heroText = !user
    ? "Plateforme officielle d'inscription en ligne aux concours d'entr?e de la Facult? des Sciences. Simple, rapide et s?curis?."
    : isAdminUser
      ? 'G?rez les candidatures, les concours et les r?sultats depuis votre tableau de bord s?curis?.'
      : 'Suivez vos candidatures, consultez vos notifications et compl?tez vos dossiers directement en ligne.'

  const primaryHref = !user ? '/auth/register' : isAdminUser ? '/admin/dashboard' : '/dashboard'
  const primaryLabel = !user ? 'Créer un compte' : isAdminUser ? 'Tableau de bord' : 'Mon espace candidat'
  const secondaryHref = isAdminUser ? '/admin/candidatures' : '/concours'
  const secondaryLabel = isAdminUser ? 'Voir les candidatures' : 'Voir les concours'

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />

      <section className="relative overflow-hidden bg-emerald-950">
        <Image
          src="/assets/campus-hero.jpg"
          alt="Campus de l'Université de Ngaoundéré"
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/88 to-emerald-900/35" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#f7fbf8] to-transparent" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8">
          <div className="min-w-0 max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-amber-100 backdrop-blur">
              <Image
                src="/assets/logo-fac-sciences.webp"
                alt="Logo Faculté des Sciences"
                width={26}
                height={26}
                className="h-6 w-6 rounded-full bg-white object-contain"
              />
              Université de Ngaoundéré - Faculté des Sciences
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">{heroTitle}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-50">{heroText}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link href={primaryHref} className="inline-flex items-center justify-center gap-2 rounded-md bg-uni-gold px-6 py-3 text-sm font-semibold text-emerald-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-400">
                {primaryLabel}
              </Link>
              <Link href={secondaryHref} className="inline-flex items-center justify-center gap-2 rounded-md border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20">
                {secondaryLabel}
              </Link>
            </div>
          </div>

          <div className="hidden self-end rounded-lg border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur md:block">
            <div className="relative aspect-[4/4] overflow-hidden rounded-md">
              <img
                src="/assets/logo-fac-sciences.webp"
                alt="Faculté des Sciences de Ngaoundéré"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="rounded-md bg-white p-2">
                <Image src="/assets/logo-univ-ngaoundere.webp" alt="Logo Université" width={36} height={36} />
              </div>
              <p className="text-sm font-medium leading-5 text-white">Un parcours d&apos;inscription clair, depuis le choix du concours jusqu&apos;à la soumission du dossier.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-8 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 rounded-lg border border-emerald-900/10 bg-white p-4 shadow-xl min-[420px]:grid-cols-2 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-md bg-slate-50 p-4 text-center">
              <p className={`mx-auto mb-3 inline-flex rounded-md px-3 py-1 text-2xl font-bold ${stat.tone}`}>{stat.value}</p>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f7fbf8] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-uni-green">Inscriptions ouvertes</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">Concours disponibles</h2>
            </div>
            <Link href="/concours" className="inline-flex items-center gap-2 text-sm font-semibold text-uni-green hover:text-emerald-800">
              Tout voir
            </Link>
          </div>

          {concours.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {concours.map((c) => (
                <article key={c.id} className="card flex min-h-[330px] flex-col transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <span className="badge-success">Inscriptions ouvertes</span>
                    <span className="rounded-md bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">{formatCurrency(Number(c.fraisInscription))}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-950">{c.titre}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{c.description}</p>
                  <div className="mt-5 space-y-2 text-sm text-slate-600">
                    <p><span className="font-semibold text-slate-900">Département :</span> {c.departement}</p>
                    <p><span className="font-semibold text-slate-900">Clôture :</span> {formatDate(c.dateCloture)}</p>
                    <p><span className="font-semibold text-slate-900">Places :</span> {c.nombrePlaces}</p>
                  </div>
                  <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row">
                    <Link href={getConcoursDetailPath(c.id)} className="btn-secondary flex-1">Détails</Link>
                    <Link href={getConcoursApplyPath(c.type, c.id)} className="btn-primary flex-1">Postuler</Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="card py-12 text-center">
              <p className="text-slate-600">Aucun concours disponible pour le moment.</p>
              <p className="mt-1 text-sm text-slate-400">Revenez bientôt pour découvrir les prochains concours.</p>
            </div>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-16">
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-emerald-900/10 bg-slate-100 shadow-sm">
            <img
              src="/assets/IMG-20230502-WA0027.jpg"
              alt="Étudiants à la Faculté des Sciences"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/75 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <p className="text-sm font-semibold text-emerald-100">Dossier en ligne</p>
              <p className="mt-1 text-2xl font-bold">Simple à remplir, facile à suivre.</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-uni-green">Comment ça marche </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">Inscrivez-vous en quelques étapes simples</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {steps.map((item) => (
                <div key={item.step} className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-emerald-950 text-lg font-bold text-white">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-lg border border-emerald-900/10 bg-emerald-50 p-4 text-sm font-medium text-emerald-950">
              Les informations et documents demandés restent liés à votre dossier jusqu&apos;à la décision finale.
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
