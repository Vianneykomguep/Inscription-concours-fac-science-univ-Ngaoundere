'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, GraduationCap, User, LogOut, Bell } from 'lucide-react'

interface HeaderProps {
  user?: { firstName: string; lastName: string; role: string } | null
}

export default function Header({ user }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-uni-green">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-uni-green">Université de Ngaoundéré</p>
              <p className="text-xs text-gray-500">Faculté des Sciences</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-uni-green transition-colors">Accueil</Link>
            <Link href="/concours" className="text-sm font-medium text-gray-600 hover:text-uni-green transition-colors">Concours</Link>
            {user ? (
              <>
                {user.role === 'CANDIDAT' ? (
                  <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-uni-green transition-colors">Mon Espace</Link>
                ) : (
                  <Link href="/admin/dashboard" className="text-sm font-medium text-gray-600 hover:text-uni-green transition-colors">Administration</Link>
                )}
                <Link href="/notifications" className="relative text-gray-600 hover:text-uni-green">
                  <Bell className="h-5 w-5" />
                </Link>
                <div className="flex items-center gap-2 rounded-full bg-gray-100 py-1.5 pl-3 pr-1.5">
                  <span className="text-sm font-medium text-gray-700">{user.firstName} {user.lastName}</span>
                  <form action="/api/auth/logout" method="POST">
                    <button type="submit" className="rounded-full bg-white p-1.5 text-gray-500 hover:text-danger-600 transition-colors">
                      <LogOut className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login" className="btn-secondary text-sm">Connexion</Link>
                <Link href="/auth/register" className="btn-primary text-sm">S&apos;inscrire</Link>
              </div>
            )}
          </nav>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-600">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link href="/" className="text-sm font-medium text-gray-700 py-2" onClick={() => setMobileOpen(false)}>Accueil</Link>
            <Link href="/concours" className="text-sm font-medium text-gray-700 py-2" onClick={() => setMobileOpen(false)}>Concours</Link>
            {user ? (
              <>
                <Link href={user.role === 'CANDIDAT' ? '/dashboard' : '/admin/dashboard'} className="text-sm font-medium text-gray-700 py-2" onClick={() => setMobileOpen(false)}>
                  {user.role === 'CANDIDAT' ? 'Mon Espace' : 'Administration'}
                </Link>
                <form action="/api/auth/logout" method="POST">
                  <button type="submit" className="text-sm font-medium text-danger-600 py-2">Déconnexion</button>
                </form>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn-secondary text-sm w-full text-center" onClick={() => setMobileOpen(false)}>Connexion</Link>
                <Link href="/auth/register" className="btn-primary text-sm w-full text-center" onClick={() => setMobileOpen(false)}>S&apos;inscrire</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
