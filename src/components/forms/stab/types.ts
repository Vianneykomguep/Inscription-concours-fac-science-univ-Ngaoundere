import type { ConcoursType } from '@prisma/client'

export type StabFormData = {
  concoursType: ConcoursType
  nom: string
  prenom: string
  dateNaissance: string
  lieuNaissance: string
  genre: string
  nationalite: string
  regionOrigine: string
  departementOrigine: string
  telephone: string
  photoUrl: string
  filiere: string
  centre: string
  signatureCandidat: string
  academic: Record<string, string>
}

export type UploadedDocumentState = Record<string, File | null>

export type ReceiptData = {
  numeroDossier: string
  dateDepot: string
  nom: string
  prenom: string
  dateNaissance: string
  lieuNaissance: string
  filiere: string
  centre: string
  signatureCandidat: string
  pdfUrl?: string
  message?: string
}
