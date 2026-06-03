'use client'

import { STAB_FORM_CONFIGS } from '@/lib/stab-config'
import type { StabFormConfig } from '@/lib/stab-config'
import STABApplicationForm from './STABApplicationForm'

export default function STABL3Form({ config = STAB_FORM_CONFIGS.STAB_L3 }: { config: StabFormConfig }) {
  return <STABApplicationForm config={config} />
}
