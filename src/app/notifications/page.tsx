import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDateTime } from '@/lib/utils'
import { canAccessAdmin } from '@/lib/permissions'
import { Bell, CheckCircle2, Inbox, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function NotificationsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  const unreadIds = notifications.filter((notification) => !notification.lu).map((notification) => notification.id)

  if (unreadIds.length > 0) {
    await prisma.notification.updateMany({
      where: { id: { in: unreadIds }, userId: user.id },
      data: { lu: true },
    })
  }

  const dashboardHref = canAccessAdmin(user) ? '/admin/dashboard' : '/dashboard'

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top_left,rgba(204,153,0,0.12),transparent_28rem),linear-gradient(180deg,#f7fbf8,#f8fafc)]">
      <Header user={user} />
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 rounded-xl border border-emerald-900/10 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-uni-green">Centre de notifications</p>
              <h1 className="mt-2 flex items-center gap-3 text-3xl font-bold tracking-tight text-slate-950">
                <Bell className="h-7 w-7 text-uni-green" />
                Notifications
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Retrouvez les informations importantes sur vos candidatures, complements demandes et resultats.
              </p>
            </div>
            <Link href={dashboardHref} className="btn-secondary inline-flex items-center justify-center">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Tableau de bord
            </Link>
          </div>

        {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <article
                  key={notification.id}
                  className={`rounded-xl border bg-white p-5 shadow-sm ${
                  notification.lu ? 'border-slate-200' : 'border-emerald-200 ring-2 ring-emerald-100'
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-3">
                      <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    notification.lu ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-uni-green'
                      }`}>
                        {notification.lu ? <CheckCircle2 className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-bold text-slate-950">{notification.titre}</h2>
                          {!notification.lu && (
                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                              Nouveau
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{notification.contenu}</p>
                      </div>
                    </div>
                    <time className="shrink-0 text-sm text-slate-500">{formatDateTime(notification.createdAt)}</time>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <Inbox className="mx-auto h-12 w-12 text-slate-300" />
              <h2 className="mt-4 text-xl font-bold text-slate-950">Aucune notification</h2>
              <p className="mt-2 text-sm text-slate-600">Les nouvelles informations liees a votre compte apparaitront ici.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
