import type { ConcoursType } from '@prisma/client'
import { hasDatabaseUrl, prisma } from '@/lib/prisma'
import { STAB_FORM_CONFIGS, type StabDocument, type StabFormConfig } from '@/lib/stab-config'

export async function getActiveStabFormConfig(type: ConcoursType): Promise<StabFormConfig> {
  const base = STAB_FORM_CONFIGS[type]
  if (!hasDatabaseUrl) return base

  const concours = await prisma.concours.findFirst({
    where: {
      type,
      isActive: true,
      statut: { in: ['PUBLIE', 'EN_COURS'] },
    },
    orderBy: { dateOuverture: 'desc' },
  }).catch((error) => {
    console.error('STAB config error:', error)
    return null
  })

  if (!concours) return base

  const configuredDocuments: StabDocument[] = concours.piecesRequises.map((label) => ({
    type: label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''),
    label,
    required: true,
  }))

  return {
    ...base,
    title: concours.titre,
    subtitle: concours.description,
    filieres: concours.filieres.length > 0 ? concours.filieres : base.filieres,
    centers: concours.centres.length > 0 ? concours.centres : base.centers,
    documents: configuredDocuments.length > 0 ? configuredDocuments : base.documents,
  }
}
