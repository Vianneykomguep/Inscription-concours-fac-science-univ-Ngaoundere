'use client'

type Props = {
  formData: any
  setFormData: (data: any) => void
}

export default function CandidateIdentitySection({
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
          Informations personnelles
        </h2>

        <p className="text-gray-500 mt-1">
          Renseignez les informations du candidat
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className="block text-sm font-medium mb-2">
            Nom
          </label>

          <input
            type="text"
            name="nom"
            value={formData.nom || ''}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Prénom
          </label>

          <input
            type="text"
            name="prenom"
            value={formData.prenom || ''}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Date de naissance
          </label>

          <input
            type="date"
            name="dateNaissance"
            value={formData.dateNaissance || ''}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Lieu de naissance
          </label>

          <input
            type="text"
            name="lieuNaissance"
            value={formData.lieuNaissance || ''}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Genre
          </label>

          <select
            name="genre"
            value={formData.genre || ''}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          >
            <option value="">Sélectionner</option>
            <option value="Masculin">Masculin</option>
            <option value="Féminin">Féminin</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Nationalité
          </label>

          <input
            type="text"
            name="nationalite"
            value={formData.nationalite || ''}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Région d'origine
          </label>

          <input
            type="text"
            name="region"
            value={formData.region || ''}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Département d'origine
          </label>

          <input
            type="text"
            name="departementOrigine"
            value={formData.departementOrigine || ''}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

      </div>
    </div>
  )
}