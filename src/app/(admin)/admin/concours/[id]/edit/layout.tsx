import { getCurrentUser } from '@/lib/auth'
import { Permission, hasPermission } from '@/lib/permissions'

export default async function EditConcoursLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user || !hasPermission({ role: user.role }, Permission.UPDATE_CONCOURS)) {
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 text-blue-900">
        <div className="mb-3 flex items-center gap-2">
          <span className="badge-info">Niveau responsable</span>
        </div>
        <h1 className="text-lg font-semibold">Modification de concours réservée</h1>
        <p className="mt-2 text-sm text-blue-800">
          Cette action nécessite le rôle Responsable ou Super Admin.
        </p>
      </div>
    )
  }

  return children
}
