type AdminPermissionNoticeProps = {
  title: string
  children: React.ReactNode
  badge?: string
}

export default function AdminPermissionNotice({
  title,
  children,
  badge = 'Accès restreint',
}: AdminPermissionNoticeProps) {
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 text-blue-900">
      <div className="mb-3 flex items-center gap-2">
        <span className="badge-info">{badge}</span>
      </div>
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-blue-800">{children}</p>
    </div>
  )
}
