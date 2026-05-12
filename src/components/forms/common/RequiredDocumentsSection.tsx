'use client'

type Props = {
  documents: string[]
}

function RequiredDocumentsSection({
  documents,
}: Props) {

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">

      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Pièces à fournir
        </h2>

        <p className="text-gray-500 mt-1">
          Téléversez les documents demandés
        </p>
      </div>

      <div className="space-y-5">

        {documents.map((doc) => (
          <div
            key={doc}
            className="border rounded-xl p-4"
          >

            <h3 className="font-semibold text-gray-900 mb-3">
              {doc}
            </h3>

            <input
              type="file"
              className="block w-full border rounded-lg p-2"
            />

          </div>
        ))}

      </div>

    </div>
  )
}

export default RequiredDocumentsSection