import path from 'path'
import type { ConcoursType } from '@prisma/client'

type ReceiptConfig = {
  label: string
  url: string
  fileName: string
}

export const RECEIPT_CONFIGS: Partial<Record<ConcoursType, ReceiptConfig>> = {
  STAB_L1: {
    label: 'Recepisse concours STAB Licence 1',
    url: '/docs/recepisses/recepisse-stab-l1.pdf',
    fileName: 'recepisse-stab-l1.pdf',
  },
  STAB_L3: {
    label: 'Recepisse concours STAB Licence 3',
    url: '/docs/recepisses/recepisse-stab-l3.pdf',
    fileName: 'recepisse-stab-l3.pdf',
  },
  STAB_MASTER: {
    label: 'Recepisse concours STAB Master 1',
    url: '/docs/recepisses/recepisse-stab-master.pdf',
    fileName: 'recepisse-stab-master.pdf',
  },
  STAB_MASTER_PRO: {
    label: 'Recepisse concours STAB Master professionnel',
    url: '/docs/recepisses/recepisse-stab-master-pro.pdf',
    fileName: 'recepisse-stab-master-pro.pdf',
  },
}

export function getReceiptConfig(type: ConcoursType | string | null | undefined) {
  if (!type) return null
  return RECEIPT_CONFIGS[type as ConcoursType] ?? null
}

export function getReceiptFilePath(type: ConcoursType | string | null | undefined) {
  const config = getReceiptConfig(type)
  if (!config) return null
  return path.join(process.cwd(), 'public', config.url)
}
