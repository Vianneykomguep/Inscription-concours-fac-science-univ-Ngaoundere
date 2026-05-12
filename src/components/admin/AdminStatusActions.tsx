'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import {
  Permission,
  hasPermission,
} from '@/lib/permissions'

import { UserRole } from '@prisma/client'

type Props = {
  candidatureId: string
  currentStatut: string
  userRole: UserRole
}

export default function AdminStatusActions({
  candidatureId,
  currentStatut,
  userRole,
}: Props) {

  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const [motif, setMotif] = useState('')

  const [complement, setComplement] =
    useState('')

  const updateStatus = async (
    statut: string
  ) => {

    setLoading(true)

    try {

      await fetch(
        `/api/admin/candidatures/${candidatureId}/statut`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            statut,
            motif: motif || undefined,
            complementInfo:
              complement || undefined
          }),
        }
      )

      router.refresh()

    } catch (e) {

      console.error(e)

    } finally {

      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="card flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="card space-y-4">

      <h3 className="font-semibold text-gray-900">
        Actions
      </h3>

      {['SOUMISE', 'EN_COURS_EXAMEN']
        .includes(currentStatut) && (
        <>

          {/* REVIEW */}
          {
            hasPermission(
              { role: userRole },
              Permission.REVIEW_CANDIDATURE
            ) && (
              <button
                onClick={() =>
                  updateStatus(
                    'EN_COURS_EXAMEN'
                  )
                }

                className="btn-primary w-full"

                disabled={
                  currentStatut ===
                  'EN_COURS_EXAMEN'
                }
              >
                Marquer en examen
              </button>
            )
          }

          {/* VALIDATE */}
          {
            hasPermission(
              { role: userRole },
              Permission.VALIDATE_CANDIDATURE
            ) && (
              <button
                onClick={() =>
                  updateStatus('VALIDEE')
                }

                className="btn-success w-full"
              >
                Valider le dossier
              </button>
            )
          }

          {/* COMPLEMENT */}
          {
            hasPermission(
              { role: userRole },
              Permission.REQUEST_COMPLEMENT
            ) && (
              <div>

                <label className="label-field">
                  Complément à demander
                </label>

                <textarea
                  className="input-field"

                  value={complement}

                  onChange={(e) =>
                    setComplement(
                      e.target.value
                    )
                  }

                  placeholder="Précisez le document manquant..."
                />

                <button
                  onClick={() =>
                    updateStatus(
                      'COMPLEMENT_DEMANDE'
                    )
                  }

                  className="btn-secondary w-full mt-2"

                  disabled={!complement}
                >
                  Demander un complément
                </button>

              </div>
            )
          }

          {/* REJECT */}
          {
            hasPermission(
              { role: userRole },
              Permission.VALIDATE_CANDIDATURE
            ) && (
              <div>

                <label className="label-field">
                  Motif de rejet
                </label>

                <textarea
                  className="input-field"

                  value={motif}

                  onChange={(e) =>
                    setMotif(
                      e.target.value
                    )
                  }

                  placeholder="Motif obligatoire..."
                />

                <button
                  onClick={() =>
                    updateStatus('REJETEE')
                  }

                  className="btn-danger w-full mt-2"

                  disabled={!motif}
                >
                  Rejeter
                </button>

              </div>
            )
          }

        </>
      )}

      {currentStatut === 'VALIDEE' && (
        <>
          {
            hasPermission(
              { role: userRole },
              Permission.PUBLISH_RESULTS
            ) && (
              <>
                <button
                  onClick={() =>
                    updateStatus(
                      'ADMISSIBLE'
                    )
                  }

                  className="btn-success w-full"
                >
                  Déclarer admissible
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      'NON_ADMIS'
                    )
                  }

                  className="btn-danger w-full"
                >
                  Non admis
                </button>
              </>
            )
          }
        </>
      )}

      {currentStatut === 'ADMISSIBLE' && (
        <>
          {
            hasPermission(
              { role: userRole },
              Permission.PUBLISH_RESULTS
            ) && (
              <>
                <button
                  onClick={() =>
                    updateStatus('ADMIS')
                  }

                  className="btn-success w-full"
                >
                  Déclarer admis
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      'NON_ADMIS'
                    )
                  }

                  className="btn-danger w-full"
                >
                  Non admis
                </button>
              </>
            )
          }
        </>
      )}

    </div>
  )
}