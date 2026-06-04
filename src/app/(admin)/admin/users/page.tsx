import Link from 'next/link'
import { UserRole } from '@prisma/client'
import { Mail, ShieldCheck, UserCheck, UserCog, Users, type LucideIcon } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { hasPermission, Permission } from '@/lib/permissions'
import AdminPermissionNotice from '@/components/admin/AdminPermissionNotice'
import CreateUserForm from '@/components/admin/CreateUserForm'
import UserAdminActions from '@/components/admin/UserAdminActions'
import { formatDate } from '@/lib/utils'

const ROLE_LABELS: Record<UserRole, string> = {
  CANDIDAT: 'Candidat',
  AGENT: 'Agent',
  RESPONSABLE: 'Responsable',
  SUPER_ADMIN: 'Super admin',
}

const ROLE_BADGES: Record<UserRole, string> = {
  CANDIDAT: 'badge-gray',
  AGENT: 'badge-info',
  RESPONSABLE: 'badge-warning',
  SUPER_ADMIN: 'badge-success',
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: { role?: string | string[]; statut?: string | string[]; q?: string | string[] }
}) {
  const currentUser = await getCurrentUser()
  if (!currentUser || !hasPermission(currentUser, Permission.MANAGE_USERS)) {
    return (
      <AdminPermissionNotice title="Gestion des utilisateurs reservee">
        Cette section necessite un compte Super Admin.
      </AdminPermissionNotice>
    )
  }

  const roleParam = firstValue(searchParams?.role)
  const statut = firstValue(searchParams?.statut) ?? ''
  const q = (firstValue(searchParams?.q) ?? '').trim()
  const role = Object.values(UserRole).includes(roleParam as UserRole) ? roleParam as UserRole : undefined

  const where = {
    ...(role ? { role } : {}),
    ...(statut === 'actifs' ? { isActive: true } : {}),
    ...(statut === 'inactifs' ? { isActive: false } : {}),
    ...(statut === 'verifies' ? { emailVerified: true } : {}),
    ...(statut === 'non-verifies' ? { emailVerified: false } : {}),
    ...(q
      ? {
          OR: [
            { email: { contains: q, mode: 'insensitive' as const } },
            { firstName: { contains: q, mode: 'insensitive' as const } },
            { lastName: { contains: q, mode: 'insensitive' as const } },
            { phone: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  }

  const [users, total, active, verified, admins, candidates] = await Promise.all([
    prisma.user.findMany({
      where,
      include: { _count: { select: { candidatures: true, notifications: true } } },
      orderBy: [{ role: 'asc' }, { createdAt: 'desc' }],
      take: 200,
    }),
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { emailVerified: true } }),
    prisma.user.count({ where: { role: { in: ['AGENT', 'RESPONSABLE', 'SUPER_ADMIN'] } } }),
    prisma.user.count({ where: { role: 'CANDIDAT' } }),
  ])

  const query = new URLSearchParams()
  if (q) query.set('q', q)

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-uni-green">Administration systeme</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-950">Utilisateurs</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Pilotez les comptes candidats et administratifs, les roles, l'activation et la verification email.
            </p>
          </div>
          <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
            Connecte : {currentUser.firstName} {currentUser.lastName}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Metric label="Comptes" value={total} icon={Users} />
        <Metric label="Actifs" value={active} icon={UserCheck} />
        <Metric label="Emails verifies" value={verified} icon={Mail} />
        <Metric label="Administratifs" value={admins} icon={ShieldCheck} />
        <Metric label="Candidats" value={candidates} icon={UserCog} />
      </section>

      <CreateUserForm />

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <form className="grid gap-3 lg:grid-cols-[1fr_190px_190px_auto]">
          <input
            name="q"
            defaultValue={q ?? ''}
            className="input-field"
            placeholder="Rechercher par nom, email ou telephone"
          />
          <select name="role" defaultValue={role ?? ''} className="input-field">
            <option value="">Tous les roles</option>
            {Object.values(UserRole).map((item) => (
              <option key={item} value={item}>{ROLE_LABELS[item]}</option>
            ))}
          </select>
          <select name="statut" defaultValue={statut ?? ''} className="input-field">
            <option value="">Tous les statuts</option>
            <option value="actifs">Actifs</option>
            <option value="inactifs">Inactifs</option>
            <option value="verifies">Emails verifies</option>
            <option value="non-verifies">Emails non verifies</option>
          </select>
          <div className="flex gap-2">
            <button className="btn-primary" type="submit">Filtrer</button>
            <Link href="/admin/users" className="btn-secondary">Reset</Link>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Comptes utilisateurs</h2>
              <p className="text-sm text-slate-500">{users.length} compte{users.length > 1 ? 's' : ''} affiche{users.length > 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-white text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Utilisateur</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Activite</th>
                <th className="px-4 py-3 font-medium">Creation</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id} className="align-top hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                        {initials(user.firstName, user.lastName)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-950">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                        {user.phone && <p className="text-xs text-slate-500">{user.phone}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={ROLE_BADGES[user.role]}>{ROLE_LABELS[user.role]}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-2">
                    <span className={user.isActive ? 'badge-success w-fit' : 'badge-danger w-fit'}>
                      {user.isActive ? 'Actif' : 'Inactif'}
                      </span>
                      <span className={user.emailVerified ? 'badge-info w-fit' : 'badge-gray w-fit'}>
                      {user.emailVerified ? 'Email verifie' : 'Email non verifie'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    <p>{user._count.candidatures} candidature{user._count.candidatures > 1 ? 's' : ''}</p>
                    <p className="text-xs text-slate-500">{user._count.notifications} notification{user._count.notifications > 1 ? 's' : ''}</p>
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    <p>{formatDate(user.createdAt)}</p>
                    <p className="text-xs text-slate-500">Maj {formatDate(user.updatedAt)}</p>
                  </td>
                  <td className="px-4 py-4">
                    <UserAdminActions
                      userId={user.id}
                      currentUserId={currentUser.id}
                      role={user.role}
                      isActive={user.isActive}
                      emailVerified={user.emailVerified}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="p-10 text-center text-sm text-slate-500">
            Aucun utilisateur ne correspond aux filtres.
          </div>
        )}
      </section>
    </div>
  )
}

function Metric({ label, value, icon: Icon }: { label: string; value: number; icon: LucideIcon }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <Icon className="h-5 w-5 text-uni-green" />
      </div>
      <p className="mt-3 text-3xl font-bold text-slate-950">{value}</p>
    </div>
  )
}

function initials(firstName: string, lastName: string) {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || 'U'
}

function firstValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}
