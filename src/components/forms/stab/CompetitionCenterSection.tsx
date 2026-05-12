'use client'

type Props = {
  centers: string[]
  value: string
  onChange: (value: string) => void
}

export default function CompetitionCenterSection({ centers, value, onChange }: Props) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">Centre de concours</h2>
      <div className="grid gap-3 md:grid-cols-3">
        {centers.map((center) => (
          <label key={center} className={`cursor-pointer rounded-lg border p-4 text-sm font-medium ${value === center ? 'border-uni-green bg-green-50 text-uni-green' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
            <input className="sr-only" type="radio" name="centre" value={center} checked={value === center} onChange={(event) => onChange(event.target.value)} />
            {center}
          </label>
        ))}
      </div>
    </section>
  )
}
