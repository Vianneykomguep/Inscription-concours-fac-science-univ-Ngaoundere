'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import type { UserRole } from '@prisma/client'
import { BarChart3, Download, FileText, GraduationCap, LayoutDashboard, Menu, Trophy, Users, X } from 'lucide-react'
import { Permission, hasPermission } from '@/lib/permissions'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard, permission: Permission.MANAGE_USERS },
  { href: '/admin/concours', label: 'Concours', icon: Trophy, permission: Permission.UPDATE_CONCOURS },
  { href: '/admin/candidatures', label: 'Candidatures', icon: FileText, permission: Permission.VIEW_CANDIDATURES },
  { href: '/admin/resultats', label: 'Resultats', icon: BarChart3, permission: Permission.PUBLISH_RESULTS },
  { href: '/admin/users', label: 'Utilisateurs', icon: Users, permission: Permission.MANAGE_USERS },
  { href: '/admin/export', label: 'Exportations', icon: Download, permission: Permission.MANAGE_USERS },
  { href: '/admin/stats', label: 'Statistiques', icon: BarChart3, permission: Permission.MANAGE_USERS },
]

export default function AdminSidebar({ userRole }: { userRole: UserRole }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const visibleNavItems = navItems.filter((item) => hasPermission({ role: userRole }, item.permission))

  return (
    <>
      <div className="fixed left-0 right-0 top-[73px] z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-uni-green">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-uni-green">Administration</p>
            <p className="text-xs text-slate-500">Faculte des Sciences</p>
          </div>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-lg border border-slate-200 p-2 text-slate-600">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      <aside
        className={cn(
          'fixed left-0 top-[73px] z-40 h-[calc(100vh-73px)] w-64 overflow-y-auto border-r border-slate-200 bg-white transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0',
        )}
      >
        <nav className="space-y-2 p-4 pt-6">
          {visibleNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all',
                  isActive ? 'bg-emerald-50 text-uni-green shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                )}
              >
                <item.icon className={cn('h-5 w-5 transition-colors', isActive ? 'text-uni-green' : 'text-slate-400 group-hover:text-slate-700')} />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
