import AdminSidebar from '@/components/layout/AdminSidebar'
import Header from '@/components/layout/Header'

import { getCurrentUser } from '@/lib/auth'

import { canAccessAdmin }
  from '@/lib/permissions'

import { redirect }
  from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const user = await getCurrentUser()

  if (!user)
    redirect('/auth/login')

  if (!canAccessAdmin(user))
    redirect('/dashboard')

  return (

    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}

      <Header user={user} />

      {/* SIDEBAR + CONTENT */}

      <div className="flex">

        <AdminSidebar userRole={user.role} />

        <main
          className="
            flex-1
            p-4
            pt-24
            lg:ml-64
            lg:p-8
          "
        >
          {children}
        </main>

      </div>

    </div>

  )
}