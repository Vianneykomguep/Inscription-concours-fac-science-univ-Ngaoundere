import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function CandidateLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')
  if (user.role !== 'CANDIDAT') redirect('/admin/dashboard')
  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top_left,rgba(204,153,0,0.12),transparent_28rem),linear-gradient(180deg,#f7fbf8,#f8fafc)]">
      <Header user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
