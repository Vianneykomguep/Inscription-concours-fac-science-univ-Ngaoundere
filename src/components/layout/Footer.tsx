import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-uni-green">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-uni-green">Université de Ngaoundéré</p>
                <p className="text-sm text-gray-500">Faculté des Sciences</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 max-w-md">
              Plateforme officielle d&apos;inscription en ligne aux concours de la Faculté des Sciences.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Liens utiles</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-uni-green transition-colors">Accueil</Link></li>
              <li><Link href="/concours" className="hover:text-uni-green transition-colors">Concours</Link></li>
              <li><Link href="/auth/register" className="hover:text-uni-green transition-colors">S&apos;inscrire</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" />Ngaoundéré, Cameroun</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" />+237 222 25 40 15</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" />fs@univ-ndere.cm</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Université de Ngaoundéré — Tous droits réservés
        </div>
      </div>
    </footer>
  )
}
