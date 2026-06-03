'use client'

import UserMenu from '../forms/common/UserMenu'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { UserRole } from '@prisma/client'
import { Bell, Menu, X } from 'lucide-react'
import { canAccessAdmin } from '@/lib/permissions'

interface HeaderProps {
  user: { firstName: string; lastName: string; role: UserRole } | null
}

export default function Header({ user }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const isAdminUser = user ? canAccessAdmin(user) : false
  const homeHref = isAdminUser ? '/admin/dashboard' : '/'
  const dashboardHref = isAdminUser ? '/admin/dashboard' : '/dashboard'
  const dashboardLabel = isAdminUser ? 'Administration' : 'Mon espace'
  const notificationLabel = unreadCount > 99 ? '99+' : String(unreadCount)

  useEffect(() => {
    if (!user) {
      setUnreadCount(0)
      return
    }

    let cancelled = false

    const loadUnreadCount = () => {
      fetch('/api/notifications/unread-count', { cache: 'no-store' })
        .then((response) => (response.ok ? response.json() : { count: 0 }))
        .then((data) => {
          if (!cancelled) setUnreadCount(Number(data.count) || 0)
        })
        .catch(() => {
          if (!cancelled) setUnreadCount(0)
        })
    }

    loadUnreadCount()
    const interval = window.setInterval(loadUnreadCount, 30000)

    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [user])

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-900/10 bg-white/90 shadow-sm backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[73px] items-center justify-between">
          <Link href={homeHref} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-emerald-100 bg-white p-1 shadow-sm">
                <Image
                  src="/assets/logo-univ-ngaoundere.webp"
                  alt="Logo Université de Ngaoundéré"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                  priority
                />
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-amber-100 bg-white p-1 shadow-sm">
                <Image
                  src="/assets/logo-fac-sciences.webp"
                  alt="Logo Faculté des Sciences"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                  priority
                />
              </div>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-950">Université de Ngaoundéré</p>
              <p className="text-xs font-medium text-slate-500">Faculté des Sciences</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <Link href={homeHref} className="text-sm font-semibold text-slate-600 transition-colors hover:text-uni-green">Accueil</Link>
            <Link href="/concours" className="text-sm font-semibold text-slate-600 transition-colors hover:text-uni-green">Concours</Link>
            {user ? (
              <>
                <Link href={dashboardHref} className="text-sm font-semibold text-slate-600 transition-colors hover:text-uni-green">{dashboardLabel}</Link>
                <Link href="/notifications" className="relative rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-uni-green" aria-label="Notifications" title="Notifications">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-bold leading-none text-white ring-2 ring-white">
                      {notificationLabel}
                    </span>
                  )}
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
            <Link href={homeHref} className="py-2 text-sm font-semibold text-slate-700" onClick={() => setMobileOpen(false)}>Accueil</Link>
            <Link href="/concours" className="py-2 text-sm font-semibold text-slate-700" onClick={() => setMobileOpen(false)}>Concours</Link>
            {user ? (
              <>
                <Link href={dashboardHref} className="py-2 text-sm font-semibold text-slate-700" onClick={() => setMobileOpen(false)}>
                  {dashboardLabel}
                </Link>
                <Link href="/notifications" className="flex items-center gap-2 py-2 text-sm font-semibold text-slate-700" onClick={() => setMobileOpen(false)}>
                  <span className="relative">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -right-2 -top-2 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white">
                        {notificationLabel}
                      </span>
                    )}
                  </span>
                  Notifications
                </Link>
                <form action="/api/auth/logout" method="POST">
                  <button type="submit" className="py-2 text-sm font-semibold text-danger-600">Déconnexion</button>
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
