import AdminPermissionNotice from '@/components/admin/AdminPermissionNotice'
import { getCurrentUser } from '@/lib/auth'
import { Permission, hasPermission } from '@/lib/permissions'

export default async function EditConcoursLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user || !hasPermission(user, Permission.UPDATE_CONCOURS)) {
    return (
      <AdminPermissionNotice title="Modification de concours réservée" badge="Niveau responsable">
        Cette action nécessite le rôle Responsable ou Super Admin.
      </AdminPermissionNotice>
    )
  }

  return children
}
