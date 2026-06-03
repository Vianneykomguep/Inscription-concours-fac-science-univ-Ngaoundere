import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-emerald-900/10 bg-emerald-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white p-1">
                <Image
                  src="/assets/logo-univ-ngaoundere.webp"
                  alt="Logo Université de Ngaoundéré"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white p-1">
                <Image
                  src="/assets/logo-fac-sciences.webp"
                  alt="Logo Faculté des Sciences"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div>
                <p className="font-bold text-white">Université de Ngaoundéré</p>
                <p className="text-sm text-emerald-100">Faculté des Sciences</p>
              </div>
            </div>
            <p className="max-w-md text-sm text-emerald-100">
              Plateforme officielle d&apos;inscription en ligne aux concours de la Faculté des Sciences.
            </p>
          </div>
          <div>
            <h3 className="mb-3 font-semibold text-white">Liens utiles</h3>
            <ul className="space-y-2 text-sm text-emerald-100">
              <li><Link href="/" className="transition-colors hover:text-uni-gold">Accueil</Link></li>
              <li><Link href="/concours" className="transition-colors hover:text-uni-gold">Concours</Link></li>
              <li><Link href="/auth/register" className="transition-colors hover:text-uni-gold">S&apos;inscrire</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-semibold text-white">Contact</h3>
            <ul className="space-y-2 text-sm text-emerald-100">
              <li>Ngaoundéré, Cameroun</li>
              <li>+237 222 25 40 15</li>
              <li>fs@univ-ndere.cm</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-emerald-100">
          © {new Date().getFullYear()} Université de Ngaoundéré - Tous droits réservés
        </div>
      </div>
    </footer>
  )
}
