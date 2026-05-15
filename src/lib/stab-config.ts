import type { ConcoursType } from '@prisma/client'

export type StabDocument = {
  type: string
  label: string
  required: boolean
}

export type StabFormConfig = {
  type: ConcoursType
  niveau: string
  departement: string
  title: string
  subtitle: string
  filieres: string[]
  centers: string[]
  documents: StabDocument[]
}

export const STAB_CENTERS = ['Maroua', 'Ngaoundere', 'Yaounde']
export const BIOMED_CENTERS = ['Ngaoundere', 'Yaounde', 'Douala', 'Garoua', 'Maroua']

export const STAB_L1_FILIERES = ['Production vegetale', 'Production animale']

export const STAB_L3_FILIERES = [
  'Horticulture',
  'Production des semences',
  'Agro-ecologie',
  'Pisciculture',
  'Aviculture',
  'Production laitiere',
  'Apiculture',
]

export const STAB_MASTER_FILIERES = STAB_L3_FILIERES
export const STAB_MASTER_PRO_FILIERES = STAB_L3_FILIERES

export const STAB_COMMON_DOCUMENTS: StabDocument[] = [
  { type: 'acte_naissance', label: 'Acte de naissance', required: true },
  { type: 'photos_identite', label: "Photos d'identite", required: true },
  { type: 'certificat_medical', label: 'Certificat medical', required: true },
  { type: 'recu_paiement', label: 'Recu de paiement', required: true },
]

export const STAB_L1_DOCUMENTS: StabDocument[] = [
  ...STAB_COMMON_DOCUMENTS,
  { type: 'bac', label: 'Baccalaureat', required: true },
  { type: 'probatoire', label: 'Probatoire', required: true },
]

export const STAB_L3_DOCUMENTS: StabDocument[] = [
  ...STAB_COMMON_DOCUMENTS,
  { type: 'diplome_acces', label: "Diplome d'acces au concours", required: true },
  { type: 'releves_l1_l2', label: 'Releves de notes L1/L2', required: true },
  { type: 'cni', label: "Carte nationale d'identite", required: true },
]

export const STAB_MASTER_DOCUMENTS: StabDocument[] = [
  ...STAB_COMMON_DOCUMENTS,
  { type: 'licence', label: 'Licence', required: true },
  { type: 'releves_licence', label: 'Releves de notes Licence', required: true },
  { type: 'demande_manuscrite', label: 'Demande manuscrite', required: true },
]

export const STAB_MASTER_PRO_DOCUMENTS: StabDocument[] = [
  ...STAB_COMMON_DOCUMENTS,
  { type: 'licence_professionnelle', label: 'Licence professionnelle', required: true },
  { type: 'releves_complets', label: 'Releves complets', required: true },
  { type: 'demande_manuscrite_timbree', label: 'Demande manuscrite timbree', required: true },
]

export const BIOMED_L1_FILIERES = [
  'Sciences biomedicales',
  'Sciences medico-sanitaires',
  'Soins infirmiers',
  'Kinesitherapie',
  'Techniques de laboratoire',
]

export const BIOMED_ADVANCED_FILIERES = [
  'Sciences biomedicales',
  'Sciences medico-sanitaires',
  'Analyses biologiques et medicales',
  'Techniques de laboratoire',
]

export const BIOMED_COMMON_DOCUMENTS: StabDocument[] = [
  { type: 'acte_naissance', label: "Copie certifiee conforme de l'acte de naissance", required: true },
  { type: 'photo_identite', label: "Photo d'identite", required: true },
  { type: 'certificat_medical', label: 'Certificat medical', required: true },
  { type: 'recu_paiement', label: "Quitus ou recu de paiement des frais de concours", required: true },
  { type: 'cni', label: "Carte nationale d'identite ou passeport", required: true },
]

export const BIOMED_L1_DOCUMENTS: StabDocument[] = [
  ...BIOMED_COMMON_DOCUMENTS,
  { type: 'bac', label: 'Baccalaureat ou GCE Advanced Level', required: true },
  { type: 'probatoire', label: 'Probatoire ou GCE Ordinary Level', required: true },
]

export const BIOMED_L3_DOCUMENTS: StabDocument[] = [
  ...BIOMED_COMMON_DOCUMENTS,
  { type: 'diplome_acces', label: "Diplome donnant acces a la Licence 3 professionnelle", required: true },
  { type: 'releves_l1_l2', label: 'Releves de notes L1 et L2', required: true },
]

export const BIOMED_MASTER_DOCUMENTS: StabDocument[] = [
  ...BIOMED_COMMON_DOCUMENTS,
  { type: 'licence', label: 'Licence ou diplome equivalent', required: true },
  { type: 'releves_licence', label: 'Releves de notes du cycle Licence', required: true },
  { type: 'demande_manuscrite', label: 'Demande manuscrite', required: true },
]

export const BIOMED_MASTER_PRO_DOCUMENTS: StabDocument[] = [
  ...BIOMED_COMMON_DOCUMENTS,
  { type: 'licence_professionnelle', label: 'Licence professionnelle ou diplome equivalent', required: true },
  { type: 'releves_complets', label: 'Releves de notes complets', required: true },
  { type: 'demande_manuscrite_timbree', label: 'Demande manuscrite timbree', required: true },
  { type: 'attestation_experience', label: 'Attestation de stage ou experience professionnelle', required: false },
]

export const STAB_FORM_CONFIGS: Record<ConcoursType, StabFormConfig> = {
  STAB_L1: {
    type: 'STAB_L1',
    niveau: 'Licence 1',
    departement: 'STAB',
    title: 'Concours STAB Licence 1',
    subtitle: 'Production vegetale et production animale',
    filieres: STAB_L1_FILIERES,
    centers: STAB_CENTERS,
    documents: STAB_L1_DOCUMENTS,
  },
  STAB_L3: {
    type: 'STAB_L3',
    niveau: 'Licence 3 professionnelle',
    departement: 'STAB',
    title: 'Concours STAB Licence 3 Professionnelle',
    subtitle: 'Formulaire de candidature en Licence 3 professionnelle',
    filieres: STAB_L3_FILIERES,
    centers: STAB_CENTERS,
    documents: STAB_L3_DOCUMENTS,
  },
  STAB_MASTER: {
    type: 'STAB_MASTER',
    niveau: 'Master',
    departement: 'STAB',
    title: 'Concours STAB Master',
    subtitle: 'Formulaire de candidature en Master',
    filieres: STAB_MASTER_FILIERES,
    centers: STAB_CENTERS,
    documents: STAB_MASTER_DOCUMENTS,
  },
  STAB_MASTER_PRO: {
    type: 'STAB_MASTER_PRO',
    niveau: 'Master professionnel',
    departement: 'STAB',
    title: 'Concours STAB Master Professionnel',
    subtitle: 'Formulaire de candidature en Master professionnel',
    filieres: STAB_MASTER_PRO_FILIERES,
    centers: STAB_CENTERS,
    documents: STAB_MASTER_PRO_DOCUMENTS,
  },
  BIOMED_L1: {
    type: 'BIOMED_L1',
    niveau: 'Licence 1',
    departement: 'Sciences biomedicales',
    title: 'Concours BIOMED Licence 1',
    subtitle: 'Candidature en premiere annee des filieres biomedicales et medico-sanitaires',
    filieres: BIOMED_L1_FILIERES,
    centers: BIOMED_CENTERS,
    documents: BIOMED_L1_DOCUMENTS,
  },
  BIOMED_L3: {
    type: 'BIOMED_L3',
    niveau: 'Licence 3 professionnelle',
    departement: 'Sciences biomedicales',
    title: 'Concours BIOMED Licence 3 professionnelle',
    subtitle: 'Candidature en Licence 3 professionnelle biomedicale',
    filieres: BIOMED_ADVANCED_FILIERES,
    centers: BIOMED_CENTERS,
    documents: BIOMED_L3_DOCUMENTS,
  },
  BIOMED_MASTER: {
    type: 'BIOMED_MASTER',
    niveau: 'Master 1',
    departement: 'Sciences biomedicales',
    title: 'Concours BIOMED Master 1',
    subtitle: 'Candidature en Master 1 sciences biomedicales',
    filieres: BIOMED_ADVANCED_FILIERES,
    centers: BIOMED_CENTERS,
    documents: BIOMED_MASTER_DOCUMENTS,
  },
  BIOMED_MASTER_PRO: {
    type: 'BIOMED_MASTER_PRO',
    niveau: 'Master professionnel',
    departement: 'Sciences biomedicales',
    title: 'Concours BIOMED Master Professionnel',
    subtitle: 'Candidature en Master professionnel biomedical',
    filieres: BIOMED_ADVANCED_FILIERES,
    centers: BIOMED_CENTERS,
    documents: BIOMED_MASTER_PRO_DOCUMENTS,
  },
}

export const STAB_TYPE_LABELS: Record<ConcoursType, string> = {
  STAB_L1: 'STAB Licence 1',
  STAB_L3: 'STAB Licence 3 Professionnelle',
  STAB_MASTER: 'STAB Master',
  STAB_MASTER_PRO: 'STAB Master Professionnel',
  BIOMED_L1: 'BIOMED Licence 1',
  BIOMED_L3: 'BIOMED Licence 3 Professionnelle',
  BIOMED_MASTER: 'BIOMED Master 1',
  BIOMED_MASTER_PRO: 'BIOMED Master Professionnel',
}
