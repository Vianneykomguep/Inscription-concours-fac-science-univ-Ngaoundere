export interface UserSession {
  id: string
  email: string
  role: string
  firstName: string
  lastName: string
  phone: string | null
  photoUrl: string | null
  emailVerified: boolean
  isActive: boolean
}

export interface ConcoursPublic {
  id: string
  titre: string
  description: string
  departement: string
  nombrePlaces: number
  fraisInscription: number
  dateOuverture: string
  dateCloture: string
  dateConcours: string | null
  statut: string
}

export interface CandidatureWithDetails {
  id: string
  numeroDossier: string
  statut: string
  etapeActuelle: number
  concours: { titre: string; departement: string }
  documents: { id: string; type: string; nomFichier: string; url: string }[]
  paiements: { id: string; montant: number; statut: string; methode: string }[]
  createdAt: string
  updatedAt: string
}

export interface StepProps {
  candidatureId: string
  onNext: () => void
  onBack?: () => void
}
