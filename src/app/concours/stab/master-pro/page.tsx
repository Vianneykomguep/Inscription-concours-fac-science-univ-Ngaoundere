import STABMasterProForm from '@/components/forms/stab/STABMasterProForm'
import STABPageShell from '@/components/forms/stab/STABPageShell'
import { getCurrentUser } from '@/lib/auth'
import { getActiveStabFormConfig } from '@/lib/stab-server'

export default async function STABMasterProPage() {
  const user = await getCurrentUser()
  const config = await getActiveStabFormConfig('STAB_MASTER_PRO')

  return (
    <STABPageShell user={user} config={config}>
      <STABMasterProForm config={config} />
    </STABPageShell>
  )
}
