'use client'

import type { ReceiptData } from './types'

type Props = {
  receipt: ReceiptData
}

export default function ReceiptPreview({ receipt }: Props) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 print:border-0 print:shadow-none">
      <div className="mb-6 flex items-start justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <p className="text-sm font-semibold uppercase text-uni-green">Faculté des Sciences - Université de Ngaoundéré</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">Récépissé de dépôt</h2>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          {receipt.pdfUrl && (
            <a href={receipt.pdfUrl} target="_blank" rel="noreferrer" className="btn-primary">
              Telecharger le PDF
            </a>
          )}
          <button type="button" onClick={() => window.print()} className="btn-secondary">
            Imprimer
          </button>
        </div>
      </div>

      {receipt.pdfUrl && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 print:hidden">
          Le recepisse officiel imprimable a aussi ete envoye par email.
        </div>
      )}

      <div className="grid gap-4 text-sm md:grid-cols-2">
        <Info label="Numéro dossier" value={receipt.numeroDossier} strong />
        <Info label="Date dépôt" value={receipt.dateDepot} />
        <Info label="Nom candidat" value={`${receipt.nom} ${receipt.prenom}`} />
        <Info label="Date de naissance" value={receipt.dateNaissance} />
        <Info label="Lieu de naissance" value={receipt.lieuNaissance} />
        <Info label="Filière choisie" value={receipt.filiere} />
        <Info label="Centre concours" value={receipt.centre} />
      </div>

      <div className="mt-10">
        <Signature label="Signature candidat" value={receipt.signatureCandidat} />
      </div>
    </section>
  )
}

function Info({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="text-xs uppercase text-gray-500">{label}</p>
      <p className={`mt-1 text-gray-900 ${strong ? 'font-mono font-bold' : 'font-medium'}`}>{value}</p>
    </div>
  )
}

function Signature({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-8 text-sm text-gray-500">{label}</p>
      <div className="border-t border-gray-300 pt-2 text-sm font-medium text-gray-900">{value}</div>
    </div>
  )
}
