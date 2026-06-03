'use client'

import { UserRole } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

type Props = {
  userId: string
  currentUserId: string
  role: UserRole
  isActive: boolean
  emailVerified: boolean
}

export default function UserAdminActions({ userId, currentUserId, role, isActive, emailVerified }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const isSelf = userId === currentUserId

  const update = (payload: Partial<{ role: UserRole; isActive: boolean; emailVerified: boolean }>) => {
    setError(null)
    startTransition(async () => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        setError(data?.error ?? 'Modification impossible')
        return
      }

      router.refresh()
    })
  }

  return (
    <div className="space-y-2">
      <select
        className="input-field min-w-[170px]"
        value={role}
        disabled={isPending || isSelf}
        onChange={(event) => update({ role: event.target.value as UserRole })}
        title={isSelf ? 'Votre propre role ne peut pas etre modifie ici' : 'Modifier le role'}
      >
        <option value="CANDIDAT">Candidat</option>
        <option value="AGENT">Agent</option>
        <option value="RESPONSABLE">Responsable</option>
        <option value="SUPER_ADMIN">Super admin</option>
      </select>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
        className={isActive ? 'btn-secondary px-3 py-2 text-xs' : 'btn-primary px-3 py-2 text-xs'}
          disabled={isPending || isSelf}
          onClick={() => update({ isActive: !isActive })}
        >
        {isActive ? 'Desactiver' : 'Activer'}
        </button>
        <button
          type="button"
        className={emailVerified ? 'btn-secondary px-3 py-2 text-xs' : 'btn-primary px-3 py-2 text-xs'}
          disabled={isPending}
          onClick={() => update({ emailVerified: !emailVerified })}
        >
        {emailVerified ? 'Marquer non verifie' : 'Verifier email'}
        </button>
      </div>

      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  )
}
