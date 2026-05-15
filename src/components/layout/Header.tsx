'use client'

import UserMenu from '../forms/common/UserMenu'
import Link from 'next/link'
import { useState } from 'react'
import type { UserRole } from '@prisma/client'
import { Bell, GraduationCap, Menu, X } from 'lucide-react'
import { canAccessAdmin } from '@/lib/permissions'

interface HeaderProps {
  user?: { firstName: string; lastName: string; role: UserRole } | null
}

export default function Header({ user }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const isAdminUser = user ? canAccessAdmin(user) : false
  const dashboardHref = isAdminUser ? '/admin/dashboard' : '/dashboard'
  const dashboardLabel = isAdminUser ? 'Administration' : 'Mon espace'

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[73px] items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-uni-green shadow-sm">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-950">Universite de Ngaoundere</p>
              <p className="text-xs font-medium text-slate-500">Faculte des Sciences</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <Link href="/" className="text-sm font-semibold text-slate-600 transition-colors hover:text-uni-green">Accueil</Link>
            <Link href="/concours" className="text-sm font-semibold text-slate-600 transition-colors hover:text-uni-green">Concours</Link>
            {user ? (
              <>
                <Link href={dashboardHref} className="text-sm font-semibold text-slate-600 transition-colors hover:text-uni-green">{dashboardLabel}</Link>
                <Link href="/notifications" className="relative rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-uni-green">
                  <Bell className="h-5 w-5" />
                </Link>
                <UserMenu user={user} />
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login" className="btn-secondary text-sm">Connexion</Link>
                <Link href="/auth/register" className="btn-primary text-sm">S'inscrire</Link>
              </div>
            )}
          </nav>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg md:hidden">
          <div className="flex flex-col gap-3">
            <Link href="/" className="py-2 text-sm font-semibold text-slate-700" onClick={() => setMobileOpen(false)}>Accueil</Link>
            <Link href="/concours" className="py-2 text-sm font-semibold text-slate-700" onClick={() => setMobileOpen(false)}>Concours</Link>
            {user ? (
              <>
                <Link href={dashboardHref} className="py-2 text-sm font-semibold text-slate-700" onClick={() => setMobileOpen(false)}>
                  {dashboardLabel}
                </Link>
                <form action="/api/auth/logout" method="POST">
                  <button type="submit" className="py-2 text-sm font-semibold text-danger-600">Deconnexion</button>
                </form>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn-secondary w-full text-center text-sm" onClick={() => setMobileOpen(false)}>Connexion</Link>
                <Link href="/auth/register" className="btn-primary w-full text-center text-sm" onClick={() => setMobileOpen(false)}>S'inscrire</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
