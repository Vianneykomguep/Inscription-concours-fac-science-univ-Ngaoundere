import { CandidatureStatut } from "@prisma/client"

export const allowedTransitions: Record<
  CandidatureStatut,
  CandidatureStatut[]
> = {
  [CandidatureStatut.BROUILLON]: [
    CandidatureStatut.SOUMISE
  ],

  [CandidatureStatut.SOUMISE]: [
  CandidatureStatut.EN_COURS_EXAMEN,
  CandidatureStatut.COMPLEMENT_DEMANDE
],
  [CandidatureStatut.EN_COURS_EXAMEN]: [
    CandidatureStatut.VALIDEE,
    CandidatureStatut.REJETEE,
    CandidatureStatut.COMPLEMENT_DEMANDE
  ],

  [CandidatureStatut.COMPLEMENT_DEMANDE]: [
    CandidatureStatut.SOUMISE,
    CandidatureStatut.EN_COURS_EXAMEN,
    CandidatureStatut.COMPLEMENT_DEMANDE,
    CandidatureStatut.VALIDEE,
    CandidatureStatut.REJETEE
  ],

  [CandidatureStatut.VALIDEE]: [
    CandidatureStatut.ADMISSIBLE
  ],

  [CandidatureStatut.ADMISSIBLE]: [
    CandidatureStatut.ADMIS,
    CandidatureStatut.NON_ADMIS
  ],

  [CandidatureStatut.REJETEE]: [],

  [CandidatureStatut.ADMIS]: [],

  [CandidatureStatut.NON_ADMIS]: [],
}
