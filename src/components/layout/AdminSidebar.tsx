'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import type { UserRole } from '@prisma/client'

import {
  BarChart3,
  Download,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Trophy,
  Users,
  Menu,
  X,
} from 'lucide-react'

import {
  Permission,
  hasPermission,
} from '@/lib/permissions'

import { cn } from '@/lib/utils'

const navItems = [
  {
    href: '/admin/dashboard',
    label: 'Tableau de bord',
    icon: LayoutDashboard,
    permission: Permission.MANAGE_USERS,
  },

  {
    href: '/admin/concours',
    label: 'Concours',
    icon: Trophy,
    permission: Permission.UPDATE_CONCOURS,
  },

  {
    href: '/admin/candidatures',
    label: 'Candidatures',
    icon: FileText,
    permission:
      Permission.VIEW_CANDIDATURES,
  },

  {
    href: '/admin/resultats',
    label: 'Résultats',
    icon: BarChart3,
    permission:
      Permission.PUBLISH_RESULTS,
  },

  {
    href: '/admin/users',
    label: 'Utilisateurs',
    icon: Users,
    permission: Permission.MANAGE_USERS,
  },

  {
    href: '/admin/export',
    label: 'Exportations',
    icon: Download,
    permission: Permission.MANAGE_USERS,
  },

  {
    href: '/admin/stats',
    label: 'Statistiques',
    icon: BarChart3,
    permission: Permission.MANAGE_USERS,
  },
]

export default function AdminSidebar({
  userRole,
}: {
  userRole: UserRole
}) {

  const pathname = usePathname()

  const [mobileOpen, setMobileOpen] =
    useState(false)

  const visibleNavItems = navItems.filter(
    (item) =>
      hasPermission(
        { role: userRole },
        item.permission
      )
  )

  return (
    <>

      {/* MOBILE TOP BAR */}

      <div className="fixed top-[73px]left-0 right-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:hidden">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-uni-green">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>

          <div>
            <p className="text-sm font-bold text-uni-green">
              Administration
            </p>

            <p className="text-xs text-gray-500">
              Faculté des Sciences
            </p>
          </div>

        </div>

        <button
          onClick={() =>
            setMobileOpen(!mobileOpen)
          }

          className="rounded-lg border border-gray-200 p-2 text-gray-600"
        >
          {
            mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )
          }
        </button>

      </div>

      {/* OVERLAY MOBILE */}

      {
        mobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"

            onClick={() =>
              setMobileOpen(false)
            }
          />
        )
      }

      {/* SIDEBAR */}

      <aside
        className={cn(

          'fixed left-0 top-[73px] z-40 h-[calc(100vh-4rem)] w-64 border-r border-gray-200 bg-white transition-transform duration-300',

          mobileOpen
            ? 'translate-x-0'
            : '-translate-x-full',

          'lg:top-[73px] lg:translate-x-0'
        )}
      >

        
        {/* NAVIGATION */}

        <nav className="space-y-2 p-4 pt-6">

          {visibleNavItems.map((item) => {

            const isActive =
              pathname.startsWith(item.href)

            return (

              <Link
                key={item.href}

                href={item.href}

                onClick={() =>
                  setMobileOpen(false)
                }

                className={cn(

                  'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',

                  isActive
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >

                <item.icon
                  className={cn(

                    'h-5 w-5 transition-colors',

                    isActive
                      ? 'text-primary-700'
                      : 'text-gray-400 group-hover:text-gray-700'
                  )}
                />

                {item.label}

              </Link>

            )
          })}

        </nav>

      </aside>

    </>
  )
}