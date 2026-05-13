import AdminPermissionNotice from '@/components/admin/AdminPermissionNotice'
import { getCurrentUser } from '@/lib/auth'
import { Permission, hasPermission } from '@/lib/permissions'

export default async function NewConcoursLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user || !hasPermission(user, Permission.CREATE_CONCOURS)) {
    return (
      <AdminPermissionNotice title="Création de concours réservée" badge="Niveau responsable">
        Cette action nécessite le rôle Responsable ou Super Admin.
      </AdminPermissionNotice>
    )
  }

  return children
}
