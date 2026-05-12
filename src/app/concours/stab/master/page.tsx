import STABMasterForm from '@/components/forms/stab/STABMasterForm'
import STABPageShell from '@/components/forms/stab/STABPageShell'
import { getCurrentUser } from '@/lib/auth'
import { getActiveStabFormConfig } from '@/lib/stab-server'

export default async function STABMasterPage() {
  const user = await getCurrentUser()
  const config = await getActiveStabFormConfig('STAB_MASTER')

  return (
    <STABPageShell user={user} config={config}>
      <STABMasterForm config={config} />
    </STABPageShell>
  )
}
