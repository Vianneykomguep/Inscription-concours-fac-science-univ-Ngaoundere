import STABL1Form from '@/components/forms/stab/STABL1Form'
import STABPageShell from '@/components/forms/stab/STABPageShell'
import { getCurrentUser } from '@/lib/auth'
import { getActiveStabFormConfig } from '@/lib/stab-server'

export default async function BiomedL1Page() {
  const user = await getCurrentUser()
  const config = await getActiveStabFormConfig('BIOMED_L1')

  return (
    <STABPageShell user={user} config={config}>
      <STABL1Form config={config} />
    </STABPageShell>
  )
}
