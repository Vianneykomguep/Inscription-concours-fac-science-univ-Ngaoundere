import STABMasterForm from '@/components/forms/stab/STABMasterForm'
import STABPageShell from '@/components/forms/stab/STABPageShell'
import { getCurrentUser } from '@/lib/auth'
import { getActiveStabFormConfig } from '@/lib/stab-server'

export default async function IaaMafMaster1Page() {
  const user = await getCurrentUser()
  const config = await getActiveStabFormConfig('IAA_MAF_M1')

  return (
    <STABPageShell user={user} config={config}>
      <STABMasterForm config={config} />
    </STABPageShell>
  )
}
