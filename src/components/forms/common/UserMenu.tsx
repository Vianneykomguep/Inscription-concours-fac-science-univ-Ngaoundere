'use client'

import { useState } from 'react'

import Link from 'next/link'

import type { UserRole }
  from '@prisma/client'

import {
  ChevronDown,
  LogOut,
  Bell,
  LayoutDashboard,
} from 'lucide-react'

import {
  canAccessAdmin,
} from '@/lib/permissions'

type Props = {
  user: {
    firstName: string
    lastName: string
    role: UserRole
  }
}

export default function UserMenu({
  user,
}: Props) {

  const [open, setOpen] =
    useState(false)

  const isAdminUser =
    canAccessAdmin(user)

  const dashboardHref =
    isAdminUser
      ? '/admin/dashboard'
      : '/dashboard'

  return (

    <div className="relative">

      {/* BUTTON */}

      <button
        onClick={() =>
          setOpen(!open)
        }

        className="
          flex items-center gap-3
          rounded-2xl border border-gray-200
          bg-white px-3 py-2
          shadow-sm transition
          hover:bg-gray-50
        "
      >

        {/* AVATAR */}

        <div
          className="
            flex h-10 w-10 items-center
            justify-center rounded-full
            bg-uni-green text-sm
            font-bold text-white
          "
        >
          {user.firstName[0]}
        </div>

        {/* USER INFOS */}

        <div className="hidden text-left sm:block">

          <p className="text-sm font-semibold text-gray-900">
            {user.firstName} {user.lastName}
          </p>

          <p className="text-xs text-gray-500">
            {user.role}
          </p>

        </div>

        <ChevronDown
          className={`
            h-4 w-4 text-gray-400
            transition-transform
            ${open ? 'rotate-180' : ''}
          `}
        />

      </button>

      {/* DROPDOWN */}

      {
        open && (

          <div
            className="
              absolute right-0 mt-3 w-64
              rounded-2xl border border-gray-200
              bg-white p-2 shadow-xl
            "
          >

            <div className="border-b border-gray-100 px-3 py-3">

              <p className="text-sm font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </p>

              <p className="text-xs text-gray-500">
                {user.role}
              </p>

            </div>

            <div className="py-2">

              <Link
                href={dashboardHref}

                className="
                  flex items-center gap-3
                  rounded-xl px-3 py-2
                  text-sm text-gray-700
                  transition hover:bg-gray-100
                "
              >
                <LayoutDashboard className="h-4 w-4" />

                Tableau de bord
              </Link>

              <Link
                href="/notifications"

                className="
                  flex items-center gap-3
                  rounded-xl px-3 py-2
                  text-sm text-gray-700
                  transition hover:bg-gray-100
                "
              >
                <Bell className="h-4 w-4" />

                Notifications
              </Link>

            </div>

            <div className="border-t border-gray-100 pt-2">

              <form
                action="/api/auth/logout"
                method="POST"
              >

                <button
                  type="submit"

                  className="
                    flex w-full items-center gap-3
                    rounded-xl px-3 py-2
                    text-sm text-red-600
                    transition hover:bg-red-50
                  "
                >
                    Déconnexion
                </button>

              </form>

            </div>

          </div>

        )
      }

    </div>

  )
}
