'use client'

import { STAB_FORM_CONFIGS } from '@/lib/stab-config'
import type { StabFormConfig } from '@/lib/stab-config'
import STABApplicationForm from './STABApplicationForm'

export default function STABMasterForm({ config = STAB_FORM_CONFIGS.STAB_MASTER }: { config: StabFormConfig }) {
  return <STABApplicationForm config={config} />
}
