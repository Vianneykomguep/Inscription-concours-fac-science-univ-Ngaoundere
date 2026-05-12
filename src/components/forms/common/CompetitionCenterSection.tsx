'use client'
import { STAB_CENTERS } from '@/lib/stab-config'

type Props = {
  formData: any
  setFormData: (data: any) => void
}

export default function CompetitionCenterSection({
  formData,
  setFormData,
}: Props) {

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">

      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Centre de concours
      </h2>

      <div className="space-y-3">

        {STAB_CENTERS.map((center) => (

          <label
            key={center}
            className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer"
          >
            <input
              type="radio"
              name="centre"
              value={center}
              checked={formData.centre === center}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  centre: e.target.value,
                })
              }
            />

            <span>{center}</span>

          </label>
        ))}

      </div>
    </div>
  )
}