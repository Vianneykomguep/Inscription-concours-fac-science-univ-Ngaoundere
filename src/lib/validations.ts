import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  firstName: z.string().min(2, 'Le prénom est requis'),
  lastName: z.string().min(2, 'Le nom est requis'),
  phone: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
})

export const concoursSchema = z.object({
  type: z.enum(['STAB_L1', 'STAB_L3', 'STAB_MASTER', 'STAB_MASTER_PRO', 'BIOMED_L1', 'BIOMED_L3', 'BIOMED_MASTER', 'BIOMED_MASTER_PRO']).default('STAB_L1'),
  titre: z.string().min(3, 'Le titre est requis'),
  description: z.string().min(10, 'La description est requise'),
  departement: z.string().min(2, 'Le département est requis'),
  filieres: z.array(z.string().min(1)).default([]),
  centres: z.array(z.string().min(1)).default([]),
  piecesRequises: z.array(z.string().min(1)).default([]),
  nombrePlaces: z.number().min(1, 'Le nombre de places doit être supérieur à 0'),
  fraisInscription: z.number().min(0),
  dateOuverture: z.string(),
  dateCloture: z.string(),
  dateConcours: z.string().optional(),
  dateResultats: z.string().optional(),
  guideUrl: z.string().optional(),
  conditionsAdmission: z.string().optional(),
  isActive: z.boolean().optional(),
})

export const stabCandidatureSchema = z.object({
  concoursType: z.enum(['STAB_L1', 'STAB_L3', 'STAB_MASTER', 'STAB_MASTER_PRO', 'BIOMED_L1', 'BIOMED_L3', 'BIOMED_MASTER', 'BIOMED_MASTER_PRO']),
  filiere: z.string().min(1, 'La filière est requise'),
  centre: z.string().min(1, 'Le centre est requis'),
  nom: z.string().min(2, 'Le nom est requis'),
  prenom: z.string().min(2, 'Le prénom est requis'),
  dateNaissance: z.string().min(1, 'La date de naissance est requise'),
  lieuNaissance: z.string().min(2, 'Le lieu de naissance est requis'),
  genre: z.string().min(1, 'Le genre est requis'),
  nationalite: z.string().min(2, 'La nationalité est requise'),
  regionOrigine: z.string().min(2, "La région d'origine est requise"),
  departementOrigine: z.string().min(2, "Le département d'origine est requis"),
  telephone: z.string().optional(),
  signatureCandidat: z.string().min(2, 'La signature du candidat est requise'),
  signatureAgent: z.string().optional(),
  academic: z.record(z.string()).default({}),
})

export const candidatureStep2Schema = z.object({
  nom: z.string().min(2, 'Le nom est requis'),
  prenom: z.string().min(2, 'Le prénom est requis'),
  dateNaissance: z.string().min(1, 'La date de naissance est requise'),
  lieuNaissance: z.string().min(2, 'Le lieu de naissance est requis'),
  sexe: z.enum(['M', 'F']),
  nationalite: z.string().min(2, 'La nationalité est requise'),
  telephone: z.string().min(9, 'Le téléphone est requis'),
  adresse: z.string().min(5, "L'adresse est requise"),
  ville: z.string().min(2, 'La ville est requise'),
})

export const candidatureStep3Schema = z.object({
  dernierDiplome: z.string().min(2, 'Le diplôme est requis'),
  etablissement: z.string().min(2, "L'établissement est requis"),
  anneeObtention: z.number().min(1990).max(new Date().getFullYear()),
  mention: z.string().optional(),
  autresFormations: z.string().optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ConcoursInput = z.infer<typeof concoursSchema>
