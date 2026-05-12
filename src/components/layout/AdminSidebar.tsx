'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { UserRole } from '@prisma/client'
import { BarChart3, Download, FileText, GraduationCap, LayoutDashboard, Trophy, Users } from 'lucide-react'
import { Permission, hasPermission } from '@/lib/permissions'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard, permission: Permission.MANAGE_USERS },
  { href: '/admin/concours', label: 'Concours', icon: Trophy, permission: Permission.UPDATE_CONCOURS },
  { href: '/admin/candidatures', label: 'Candidatures', icon: FileText, permission: Permission.VIEW_CANDIDATURES },
  { href: '/admin/resultats', label: 'Résultats', icon: BarChart3, permission: Permission.PUBLISH_RESULTS },
  { href: '/admin/users', label: 'Utilisateurs', icon: Users, permission: Permission.MANAGE_USERS },
  { href: '/admin/export', label: 'Exportations', icon: Download, permission: Permission.MANAGE_USERS },
  { href: '/admin/stats', label: 'Statistiques', icon: BarChart3, permission: Permission.MANAGE_USERS },
]

export default function AdminSidebar({ userRole }: { userRole: UserRole }) {
  const pathname = usePathname()
  const visibleNavItems = navItems.filter((item) => hasPermission({ role: userRole }, item.permission))

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-uni-green">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-uni-green">Admin</p>
          <p className="text-xs text-gray-500">Faculté des Sciences</p>
        </div>
      </div>

      <nav className="space-y-1 p-4">
        {visibleNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100',
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
