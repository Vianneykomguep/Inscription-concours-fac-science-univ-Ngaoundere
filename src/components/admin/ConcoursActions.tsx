'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { UserRole } from '@prisma/client'
import { CheckCircle, Edit, Trash2 } from 'lucide-react'
import { Permission, hasPermission } from '@/lib/permissions'

interface ConcoursActionsProps {
  concoursId: string
  currentStatus: string
  userRole: UserRole
}

export default function ConcoursActions({ concoursId, currentStatus, userRole }: ConcoursActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [newStatus, setNewStatus] = useState(currentStatus)

  const canUpdate = hasPermission({ role: userRole }, Permission.UPDATE_CONCOURS)
  const canDelete = hasPermission({ role: userRole }, Permission.DELETE_CONCOURS)

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce concours ?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/concours/${concoursId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/admin/concours')
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch (error) {
      alert('Erreur: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async () => {
    if (newStatus === currentStatus) return

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/concours/${concoursId}/statut`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut: newStatus }),
      })

      if (response.ok) {
        router.refresh()
        alert('Statut mis à jour avec succès')
      } else {
        alert('Erreur lors de la mise à jour du statut')
      }
    } catch (error) {
      alert('Erreur: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  if (!canUpdate && !canDelete) {
    return (
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        Les actions sur les concours nécessitent un niveau responsable.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {canUpdate && (
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="label-field mb-0">Changer le statut</label>
            <span className="badge-info">Niveau responsable</span>
          </div>
          <div className="flex gap-3">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="input-field flex-1"
              disabled={loading}
            >
              <option value="BROUILLON">Brouillon</option>
              <option value="PUBLIE">Publié</option>
              <option value="EN_COURS">En cours</option>
              <option value="CLOTURE">Clôturé</option>
              <option value="ARCHIVE">Archivé</option>
            </select>
            <button
              onClick={handleStatusChange}
              disabled={loading || newStatus === currentStatus}
              className="btn-success"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {loading ? 'Mise à jour...' : 'Appliquer'}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Un concours en brouillon ne sera pas visible aux candidats. Passer à "Publié" ou "En cours" pour l'activer.
          </p>
        </div>
      )}

      <div className="border-t border-gray-200 pt-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Autres actions</h3>
        <div className="flex flex-col gap-2 sm:flex-row">
          {canUpdate && (
            <Link
              href={`/admin/concours/${concoursId}/edit`}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Modifier
            </Link>
          )}
          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="btn-danger flex items-center justify-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </button>
          )}
        </div>
        {canDelete && (
          <p className="mt-2 text-xs text-gray-500">La suppression est réservée au super administrateur.</p>
        )}
      </div>
    </div>
  )
}
