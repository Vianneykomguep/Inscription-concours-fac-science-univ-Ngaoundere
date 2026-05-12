'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { UserRole } from '@prisma/client'
import { CheckCircle, Edit2, Eye, Trash2 } from 'lucide-react'
import { Permission, hasPermission } from '@/lib/permissions'

interface ConcoursRowActionsProps {
  id: string
  titre: string
  statut: string
  userRole: UserRole
}

export default function ConcoursRowActions({ id, titre, statut, userRole }: ConcoursRowActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const canUpdate = hasPermission({ role: userRole }, Permission.UPDATE_CONCOURS)
  const canDelete = hasPermission({ role: userRole }, Permission.DELETE_CONCOURS)

  const handleDelete = async () => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${titre}" ?`)) return

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/concours/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        const data = await response.json()
        alert(data?.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      alert('Erreur: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async () => {
    const newStatus = statut === 'BROUILLON' ? 'PUBLIE' : 'BROUILLON'

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/concours/${id}/statut`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut: newStatus }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Erreur lors de la mise à jour du statut')
      }
    } catch (error) {
      alert('Erreur: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Link
        href={`/admin/concours/${id}`}
        className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white p-2 text-gray-600 hover:bg-gray-50"
        title="Voir les détails"
      >
        <Eye className="h-4 w-4" />
      </Link>

      {canUpdate && (
        <>
          <Link
            href={`/admin/concours/${id}/edit`}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white p-2 text-gray-600 hover:bg-gray-50"
            title="Modifier - niveau responsable"
          >
            <Edit2 className="h-4 w-4" />
          </Link>
          <button
            onClick={toggleStatus}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md border border-green-300 bg-green-50 p-2 text-green-600 hover:bg-green-100 disabled:opacity-50"
            title={statut === 'BROUILLON' ? 'Publier - niveau responsable' : 'Revenir à brouillon - niveau responsable'}
          >
            <CheckCircle className="h-4 w-4" />
          </button>
        </>
      )}

      {canDelete && (
        <button
          onClick={handleDelete}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md border border-red-300 bg-red-50 p-2 text-red-600 hover:bg-red-100 disabled:opacity-50"
          title="Supprimer - super admin"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
