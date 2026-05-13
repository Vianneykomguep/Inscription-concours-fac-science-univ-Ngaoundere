import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import type { StabFormConfig } from '@/lib/stab-config'
import type React from 'react'
import type { UserRole } from '@prisma/client'
import Link from 'next/link'
import { ArrowLeft, FileText, MapPin } from 'lucide-react'

type Props = {
  user: { firstName: string; lastName: string; role: UserRole } | null
  config: StabFormConfig
  children: React.ReactNode
}

export default function STABPageShell({ user, config, children }: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} />
      <main className="flex-1 bg-gray-50">
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-10">
            <Link href="/concours" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-uni-green">
              <ArrowLeft className="h-4 w-4" /> Retour aux concours
            </Link>
            <div className="grid gap-6 md:grid-cols-[1fr_280px] md:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-uni-green">Département STAB</p>
                <h1 className="mt-2 text-4xl font-bold text-gray-950">{config.title}</h1>
                <p className="mt-3 text-gray-600">{config.subtitle}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-uni-green" />
                  {config.centers.length} centres disponibles
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-uni-green" />
                  {config.documents.length} pièces demandées
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-10">
          {!user && (
            <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
              Connectez-vous avant de soumettre le formulaire. Vous pouvez préparer le dossier ici, mais l'envoi final nécessite un compte candidat.
              <Link href="/auth/login" className="ml-2 font-semibold underline">Connexion</Link>
            </div>
          )}
          {children}
        </section>
      </main>
      <Footer />
    </div>
  )
}
