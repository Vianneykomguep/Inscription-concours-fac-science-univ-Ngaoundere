import { UserRole } from "@prisma/client"

export enum Permission {
  VIEW_CANDIDATURES = "VIEW_CANDIDATURES",

  REVIEW_CANDIDATURE = "REVIEW_CANDIDATURE",

  REQUEST_COMPLEMENT = "REQUEST_COMPLEMENT",

  VALIDATE_CANDIDATURE = "VALIDATE_CANDIDATURE",

  PUBLISH_RESULTS = "PUBLISH_RESULTS",

  CREATE_CONCOURS = "CREATE_CONCOURS",

  UPDATE_CONCOURS = "UPDATE_CONCOURS",

  DELETE_CONCOURS = "DELETE_CONCOURS",

  MANAGE_USERS = "MANAGE_USERS",
}

export const rolePermissions: Record<
  UserRole,
  Permission[]
> = {
  [UserRole.CANDIDAT]: [],

  [UserRole.AGENT]: [
    Permission.VIEW_CANDIDATURES,
    Permission.REVIEW_CANDIDATURE,
    Permission.REQUEST_COMPLEMENT,
  ],

  [UserRole.RESPONSABLE]: [
    Permission.VIEW_CANDIDATURES,
    Permission.REVIEW_CANDIDATURE,
    Permission.REQUEST_COMPLEMENT,
    Permission.VALIDATE_CANDIDATURE,
    Permission.PUBLISH_RESULTS,
    Permission.CREATE_CONCOURS,
    Permission.UPDATE_CONCOURS,
  ],

  [UserRole.SUPER_ADMIN]:
    Object.values(Permission) as Permission[],
}

export const ADMIN_ACCESS_PERMISSIONS = [
  Permission.VIEW_CANDIDATURES,
  Permission.CREATE_CONCOURS,
  Permission.UPDATE_CONCOURS,
  Permission.DELETE_CONCOURS,
  Permission.MANAGE_USERS,
] as const

export function hasAnyPermission(
  user: { role: UserRole },
  permissions: readonly Permission[]
) {
  return permissions.some((permission) =>
    hasPermission(user, permission)
  )
}

export function hasPermission(
  user: { role: UserRole },
  permission: Permission
) {
  return rolePermissions[user.role].includes(permission)
}

export function canAccessAdmin(
  user: { role: UserRole }
) {
  return hasAnyPermission(
    user,
    ADMIN_ACCESS_PERMISSIONS
  )
}

export function requirePermission(
  user: { role: UserRole },
  permission: Permission
) {
  if (!hasPermission(user, permission)) {
    throw new Error("Unauthorized")
  }
}
