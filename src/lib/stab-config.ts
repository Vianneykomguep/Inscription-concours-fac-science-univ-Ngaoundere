import type { ConcoursType } from '@prisma/client'

export type StabDocument = {
  type: string
  label: string
  required: boolean
}

export type StabFormConfig = {
  type: ConcoursType
  title: string
  subtitle: string
  filieres: string[]
  centers: string[]
  documents: StabDocument[]
}

export const STAB_CENTERS = ['Maroua', 'Ngaoundéré', 'Yaoundé']

export const STAB_L1_FILIERES = ['Production végétale', 'Production animale']

export const STAB_L3_FILIERES = [
  'Horticulture',
  'Production des semences',
  'Agro-écologie',
  'Pisciculture',
  'Aviculture',
  'Production laitière',
  'Apiculture',
]

export const STAB_MASTER_FILIERES = STAB_L3_FILIERES

export const STAB_MASTER_PRO_FILIERES = STAB_L3_FILIERES

export const STAB_COMMON_DOCUMENTS: StabDocument[] = [
  { type: 'acte_naissance', label: 'Acte de naissance', required: true },
  { type: 'photos_identite', label: "Photos d'identité", required: true },
  { type: 'certificat_medical', label: 'Certificat médical', required: true },
  { type: 'recu_paiement', label: 'Reçu de paiement', required: true },
]

export const STAB_L1_DOCUMENTS: StabDocument[] = [
  ...STAB_COMMON_DOCUMENTS,
  { type: 'bac', label: 'Baccalauréat', required: true },
  { type: 'probatoire', label: 'Probatoire', required: true },
]

export const STAB_L3_DOCUMENTS: StabDocument[] = [
  ...STAB_COMMON_DOCUMENTS,
  { type: 'diplome_acces', label: "Diplôme d'accès au concours", required: true },
  { type: 'releves_l1_l2', label: 'Relevés de notes L1/L2', required: true },
  { type: 'cni', label: 'Carte nationale d’identité', required: true },
]

export const STAB_MASTER_DOCUMENTS: StabDocument[] = [
  ...STAB_COMMON_DOCUMENTS,
  { type: 'licence', label: 'Licence', required: true },
  { type: 'releves_licence', label: 'Relevés de notes Licence', required: true },
  { type: 'demande_manuscrite', label: 'Demande manuscrite', required: true },
]

export const STAB_MASTER_PRO_DOCUMENTS: StabDocument[] = [
  ...STAB_COMMON_DOCUMENTS,
  { type: 'licence_professionnelle', label: 'Licence professionnelle', required: true },
  { type: 'releves_complets', label: 'Relevés complets', required: true },
  { type: 'demande_manuscrite_timbree', label: 'Demande manuscrite timbrée', required: true },
]

export const STAB_FORM_CONFIGS: Record<ConcoursType, StabFormConfig> = {
  STAB_L1: {
    type: 'STAB_L1',
    title: 'Concours STAB Licence 1',
    subtitle: 'Production végétale et production animale',
    filieres: STAB_L1_FILIERES,
    centers: STAB_CENTERS,
    documents: STAB_L1_DOCUMENTS,
  },
  STAB_L3: {
    type: 'STAB_L3',
    title: 'Concours STAB Licence 3 Professionnelle',
    subtitle: 'Formulaire de candidature en Licence 3 professionnelle',
    filieres: STAB_L3_FILIERES,
    centers: STAB_CENTERS,
    documents: STAB_L3_DOCUMENTS,
  },
  STAB_MASTER: {
    type: 'STAB_MASTER',
    title: 'Concours STAB Master',
    subtitle: 'Formulaire de candidature en Master',
    filieres: STAB_MASTER_FILIERES,
    centers: STAB_CENTERS,
    documents: STAB_MASTER_DOCUMENTS,
  },
  STAB_MASTER_PRO: {
    type: 'STAB_MASTER_PRO',
    title: 'Concours STAB Master Professionnel',
    subtitle: 'Formulaire de candidature en Master professionnel',
    filieres: STAB_MASTER_PRO_FILIERES,
    centers: STAB_CENTERS,
    documents: STAB_MASTER_PRO_DOCUMENTS,
  },
}

export const STAB_TYPE_LABELS: Record<ConcoursType, string> = {
  STAB_L1: 'STAB Licence 1',
  STAB_L3: 'STAB Licence 3 Professionnelle',
  STAB_MASTER: 'STAB Master',
  STAB_MASTER_PRO: 'STAB Master Professionnel',
}
