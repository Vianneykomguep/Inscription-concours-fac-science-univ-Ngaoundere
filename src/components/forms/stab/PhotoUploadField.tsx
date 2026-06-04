'use client'

type Props = {
  value: File | null
  onChange: (file: File | null) => void
}

export default function PhotoUploadField({ value, onChange }: Props) {
  return (
    <div>
      <label className="label-field" htmlFor="photo">Photo du candidat</label>
      <input
        id="photo"
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        className="input-field"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
      <p className="mt-2 text-xs text-gray-500">
        Formats acceptés : JPG ou PNG. Taille maximale : 4 Mo.
      </p>
      {value && <p className="mt-2 text-sm text-green-700">{value.name}</p>}
    </div>
  )
}

