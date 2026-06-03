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

export const DEPARTMENT_OPTIONS = [
  { value: 'IAA-MAF', label: 'IAA-MAF' },
  { value: 'STAB', label: 'STAB' },
  { value: 'Sciences biomedicales', label: 'Sciences biomedicales' },
] as const

export const LEVEL_OPTIONS = [
  { value: 'L1', label: 'L1' },
  { value: 'L3', label: 'L3' },
  { value: 'M1', label: 'M1' },
  { value: 'M2', label: 'M2' },
] as const

export type ConcoursDepartment = (typeof DEPARTMENT_OPTIONS)[number]['value']
export type ConcoursLevel = (typeof LEVEL_OPTIONS)[number]['value']

const DEPARTMENT_ORDER = DEPARTMENT_OPTIONS.map((option) => option.value)

const TYPE_BY_DEPARTMENT_AND_LEVEL: Record<ConcoursDepartment, Partial<Record<ConcoursLevel, ConcoursType>>> = {
  'IAA-MAF': {
    M1: 'IAA_MAF_M1',
  },
  STAB: {
    L1: 'STAB_L1',
    L3: 'STAB_L3',
    M1: 'STAB_MASTER',
    M2: 'STAB_MASTER_PRO',
  },
  'Sciences biomedicales': {
    L1: 'BIOMED_L1',
    L3: 'BIOMED_L3',
    M1: 'BIOMED_MASTER',
    M2: 'BIOMED_MASTER_PRO',
  },
}

export function getConcoursTypeFromDepartmentAndLevel(departement: string, niveau: string): ConcoursType {
  const safeDepartment = DEPARTMENT_OPTIONS.some((option) => option.value === departement)
    ? (departement as ConcoursDepartment)
    : 'IAA-MAF'
  const safeLevel = LEVEL_OPTIONS.some((option) => option.value === niveau)
    ? (niveau as ConcoursLevel)
    : getAvailableLevelsForDepartment(safeDepartment)[0]

  return TYPE_BY_DEPARTMENT_AND_LEVEL[safeDepartment][safeLevel] ?? TYPE_BY_DEPARTMENT_AND_LEVEL[safeDepartment][getAvailableLevelsForDepartment(safeDepartment)[0]]!
}

export function getAvailableLevelsForDepartment(departement: string): ConcoursLevel[] {
  const safeDepartment = DEPARTMENT_OPTIONS.some((option) => option.value === departement)
    ? (departement as ConcoursDepartment)
    : 'IAA-MAF'

  return LEVEL_OPTIONS
    .map((option) => option.value)
    .filter((level) => Boolean(TYPE_BY_DEPARTMENT_AND_LEVEL[safeDepartment][level]))
}

export function getDepartmentSortRank(departement: string) {
  const index = DEPARTMENT_ORDER.indexOf(departement as ConcoursDepartment)
  return index === -1 ? DEPARTMENT_ORDER.length : index
}

export function getDepartmentAndLevelFromConcoursType(type: ConcoursType): {
  departement: ConcoursDepartment
  niveau: ConcoursLevel
} {
  for (const department of DEPARTMENT_OPTIONS) {
    for (const level of LEVEL_OPTIONS) {
      if (TYPE_BY_DEPARTMENT_AND_LEVEL[department.value][level.value] === type) {
        return { departement: department.value, niveau: level.value }
      }
    }
  }

  return { departement: 'IAA-MAF', niveau: 'M1' }
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

export const IAA_MAF_M1_FILIERES = [
  'Applied Artificial Intelligence',
  'Financial Mathematics',
]

export const IAA_MAF_CENTERS = ['Ngaoundere', 'Yaounde (Nkolbisson)', 'Maroua']

export const IAA_MAF_M1_DOCUMENTS: StabDocument[] = [
  { type: 'demande_manuscrite_timbree', label: 'Demande manuscrite timbree', required: true },
  { type: 'formulaire_candidature', label: 'Formulaire de candidature dument rempli', required: true },
  { type: 'acte_naissance', label: "Copie certifiee conforme de l'acte de naissance", required: true },
  { type: 'diplome_requis', label: 'Copie certifiee conforme du diplome requis ou equivalent', required: true },
  { type: 'piece_identite', label: "Copie certifiee conforme de la carte nationale d'identite ou du passeport", required: true },
  { type: 'certificat_medical', label: "Certificat medical delivre par le CMS de l'Universite de Ngaoundere ou par un medecin de l'administration", required: true },
  { type: 'releves_licence', label: 'Releves de notes du ou des niveaux du cycle Licence professionnelle', required: true },
  { type: 'recu_paiement', label: "Recu de paiement des frais d'etude du dossier de 20 000 FCFA", required: true },
  { type: 'enveloppes_timbrees', label: "Deux enveloppes format 28 x 37 timbrees a l'adresse du candidat", required: true },
]

export const STAB_FORM_CONFIGS: Record<ConcoursType, StabFormConfig> = {
  IAA_MAF_M1: {
    type: 'IAA_MAF_M1',
    niveau: 'Master professionnel 1',
    departement: 'IAA-MAF',
    title: 'Concours IAA-MAF Master professionnel 1',
    subtitle:
      "Premiere annee du Master professionnel en Intelligence artificielle appliquee et Mathematiques financieres.",
    filieres: IAA_MAF_M1_FILIERES,
    centers: IAA_MAF_CENTERS,
    documents: IAA_MAF_M1_DOCUMENTS,
  },
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
  IAA_MAF_M1: 'IAA-MAF Master professionnel 1',
  STAB_L1: 'STAB Licence 1',
  STAB_L3: 'STAB Licence 3 Professionnelle',
  STAB_MASTER: 'STAB Master',
  STAB_MASTER_PRO: 'STAB Master Professionnel',
  BIOMED_L1: 'BIOMED Licence 1',
  BIOMED_L3: 'BIOMED Licence 3 Professionnelle',
  BIOMED_MASTER: 'BIOMED Master 1',
  BIOMED_MASTER_PRO: 'BIOMED Master Professionnel',
}
