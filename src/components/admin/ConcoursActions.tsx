'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Trash2, Edit, CheckCircle } from 'lucide-react'

interface ConcoursActionsProps {
  concoursId: string
  currentStatus: string
}

export default function ConcoursActions({ concoursId, currentStatus }: ConcoursActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [newStatus, setNewStatus] = useState(currentStatus)

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

  return (
    <div className="space-y-4">
      <div>
        <label className="label-field">Changer le statut</label>
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
            <CheckCircle className="h-4 w-4 mr-2" />
            {loading ? 'Mise à jour...' : 'Appliquer'}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Un concours en brouillon ne sera pas visible aux candidats. Passer à "Publié" ou "En cours" pour l'activer.
        </p>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Autres actions</h3>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href={`/admin/concours/${concoursId}/edit`}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Modifier
          </Link>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="btn-danger flex items-center justify-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}
