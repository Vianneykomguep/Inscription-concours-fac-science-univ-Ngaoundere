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

    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(204,153,0,0.10),transparent_28rem),linear-gradient(180deg,#f7fbf8,#f8fafc)]">

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
