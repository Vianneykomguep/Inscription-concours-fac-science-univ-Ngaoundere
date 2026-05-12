'use client'

type Props = {
  formData: any
  setFormData: (data: any) => void
}

export default function AcademicInformationSection({
  formData,
  setFormData,
}: Props) {

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">

      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Informations académiques
        </h2>

        <p className="text-gray-500 mt-1">
          Informations sur les diplômes obtenus
        </p>
      </div>

      {/* PROBATOIRE */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className="block text-sm font-medium mb-2">
            Année obtention Probatoire
          </label>

          <input
            type="number"
            name="anneeProbatoire"
            value={formData.anneeProbatoire || ''}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Mention Probatoire
          </label>

          <select
            name="mentionProbatoire"
            value={formData.mentionProbatoire || ''}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          >
            <option value="">Sélectionner</option>

            <option value="Passable">Passable</option>
            <option value="Assez Bien">Assez Bien</option>
            <option value="Bien">Bien</option>
            <option value="Très Bien">Très Bien</option>
          </select>
        </div>

      </div>

      {/* BAC */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className="block text-sm font-medium mb-2">
            Année obtention BAC
          </label>

          <input
            type="number"
            name="anneeBac"
            value={formData.anneeBac || ''}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Mention BAC
          </label>

          <select
            name="mentionBac"
            value={formData.mentionBac || ''}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          >
            <option value="">Sélectionner</option>

            <option value="Passable">Passable</option>
            <option value="Assez Bien">Assez Bien</option>
            <option value="Bien">Bien</option>
            <option value="Très Bien">Très Bien</option>
          </select>
        </div>

      </div>

    </div>
  )
}