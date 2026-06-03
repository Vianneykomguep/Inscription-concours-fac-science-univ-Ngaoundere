import type { ConcoursType } from '@prisma/client'

export const STAB_CONCOURS_PATHS: Record<ConcoursType, string> = {
  IAA_MAF_M1: '/concours/iaa-maf/m1',
  STAB_L1: '/concours/stab/l1',
  STAB_L3: '/concours/stab/l3',
  STAB_MASTER: '/concours/stab/master',
  STAB_MASTER_PRO: '/concours/stab/master-pro',
  BIOMED_L1: '/concours/biomed/l1',
  BIOMED_L3: '/concours/biomed/l3-pro',
  BIOMED_MASTER: '/concours/biomed/master-1',
  BIOMED_MASTER_PRO: '/concours/biomed/master-pro',
}

export function getConcoursApplyPath(type: ConcoursType, fallbackId: string) {
  return STAB_CONCOURS_PATHS[type] ?? (fallbackId ? `/concours/${fallbackId}` : '/concours')
}

export function getConcoursDetailPath(id: string) {
  return `/concours/${id}`
}
