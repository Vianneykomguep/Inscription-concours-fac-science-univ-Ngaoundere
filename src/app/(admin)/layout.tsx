import AdminSidebar from '@/components/layout/AdminSidebar'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')
  if (user.role === 'CANDIDAT') redirect('/dashboard')
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar userRole={user.role} />
      <main className="ml-64 p-8">{children}</main>
    </div>
  )
}
