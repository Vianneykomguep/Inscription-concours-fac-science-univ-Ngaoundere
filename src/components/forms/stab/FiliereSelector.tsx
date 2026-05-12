'use client'

type Props = {
  filieres: string[]
  value: string
  onChange: (value: string) => void
}

export default function FiliereSelector({ filieres, value, onChange }: Props) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">Filière choisie</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {filieres.map((filiere) => (
          <label key={filiere} className={`cursor-pointer rounded-lg border p-4 text-sm font-medium ${value === filiere ? 'border-uni-green bg-green-50 text-uni-green' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
            <input className="sr-only" type="radio" name="filiere" value={filiere} checked={value === filiere} onChange={(event) => onChange(event.target.value)} />
            {filiere}
          </label>
        ))}
      </div>
    </section>
  )
}
