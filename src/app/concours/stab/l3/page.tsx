import STABL3Form from '@/components/forms/stab/STABL3Form'
import STABPageShell from '@/components/forms/stab/STABPageShell'
import { getCurrentUser } from '@/lib/auth'
import { getActiveStabFormConfig } from '@/lib/stab-server'

export default async function STABL3Page() {
  const user = await getCurrentUser()
  const config = await getActiveStabFormConfig('STAB_L3')

  return (
    <STABPageShell user={user} config={config}>
      <STABL3Form config={config} />
    </STABPageShell>
  )
}
