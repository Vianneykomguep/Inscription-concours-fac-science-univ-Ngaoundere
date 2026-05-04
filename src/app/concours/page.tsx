import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Calendar, Users, MapPin } from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'

export default async function ConcoursListPage() {
  const user = await getCurrentUser()
  const concours = await prisma.concours.findMany({ where: { statut: { in: ['PUBLIE', 'EN_COURS'] } }, orderBy: { dateCloture: 'asc' } })
  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Concours disponibles</h1>
          <p className="text-gray-600 mb-8">Consultez et inscrivez-vous aux concours ouverts</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {concours.map(c => (
              <div key={c.id} className="card hover:shadow-md transition-shadow">
                <span className="badge-success mb-3">Inscriptions ouvertes</span>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{c.titre}</h2>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{c.description}</p>
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4" />{c.departement}</div>
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4" />Clôture: {formatDate(c.dateCloture)}</div>
                  <div className="flex items-center gap-2"><Users className="h-4 w-4" />{c.nombrePlaces} places</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-uni-green">{formatCurrency(Number(c.fraisInscription))}</span>
                  <Link href={`/concours/${c.id}`} className="btn-primary text-sm">Détails</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
