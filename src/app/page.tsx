import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { GraduationCap, FileCheck, Users, Shield, ArrowRight, Calendar, MapPin } from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'
import { getConcoursApplyPath, getConcoursDetailPath } from '@/lib/concours-links'

export default async function HomePage() {
  const user = await getCurrentUser()
  const concours = await prisma.concours.findMany({
    where: { statut: 'PUBLIE' },
    orderBy: { dateCloture: 'asc' },
    take: 6,
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-uni-green via-green-800 to-green-900">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-uni-gold backdrop-blur mb-6">
              <GraduationCap className="h-4 w-4" />
              Université de Ngaoundéré — Faculté des Sciences
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Inscrivez-vous aux <span className="text-uni-gold">concours</span> en ligne
            </h1>
            <p className="mt-6 text-lg text-green-100 max-w-2xl">
              Plateforme officielle d&apos;inscription en ligne aux concours d&apos;entrée de la Faculté des Sciences. 
              Simple, rapide et sécurisé.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-lg bg-uni-gold px-6 py-3 text-sm font-semibold text-uni-dark shadow-lg transition-all hover:bg-yellow-500">
                Créer un compte <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/concours" className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/20">
                Voir les concours
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { icon: GraduationCap, value: '10+', label: 'Concours par an' },
              { icon: Users, value: '5000+', label: 'Candidats inscrits' },
              { icon: FileCheck, value: '100%', label: 'Dématérialisé' },
              { icon: Shield, value: '24/7', label: 'Disponible' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="mx-auto h-8 w-8 text-uni-green mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Concours */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Concours disponibles</h2>
            <p className="mt-2 text-gray-600">Retrouvez tous les concours ouverts aux inscriptions</p>
          </div>
          {concours.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {concours.map((c) => (
                <div key={c.id} className="card hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <span className="badge-success">Inscriptions ouvertes</span>
                    <span className="text-lg font-bold text-uni-green">{formatCurrency(Number(c.fraisInscription))}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{c.titre}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{c.description}</p>
                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4" />{c.departement}</div>
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4" />Clôture: {formatDate(c.dateCloture)}</div>
                    <div className="flex items-center gap-2"><Users className="h-4 w-4" />{c.nombrePlaces} places</div>
                  </div>
                  <div className="flex gap-3">
                    <Link href={getConcoursDetailPath(c.id)} className="btn-secondary flex-1 text-center">
                      Détails
                    </Link>
                    <Link href={getConcoursApplyPath(c.type, c.id)} className="btn-primary flex-1 text-center">
                      Postuler
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 card">
              <GraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">Aucun concours disponible pour le moment.</p>
              <p className="text-sm text-gray-400 mt-1">Revenez bientôt pour découvrir les prochains concours.</p>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Comment ça marche ?</h2>
            <p className="mt-2 text-gray-600">Inscrivez-vous en quelques étapes simples</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {[
              { step: '1', title: 'Créez votre compte', desc: 'Inscrivez-vous avec votre email et vérifiez votre adresse.' },
              { step: '2', title: 'Choisissez un concours', desc: 'Parcourez les concours disponibles et sélectionnez le vôtre.' },
              { step: '3', title: 'Remplissez le dossier', desc: 'Complétez le formulaire et téléversez vos documents.' },
              { step: '4', title: 'Payez et soumettez', desc: 'Uploadez votre quitus de paiement et soumettez votre dossier.' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-uni-green text-white text-lg font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
