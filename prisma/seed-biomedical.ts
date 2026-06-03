import { PrismaClient, ConcoursStatut, ConcoursType } from '@prisma/client'
import { STAB_FORM_CONFIGS } from '../src/lib/stab-config'

const prisma = new PrismaClient()

const BIOMED_TYPES = [
  'BIOMED_L1',
  'BIOMED_L3',
  'BIOMED_MASTER',
  'BIOMED_MASTER_PRO',
] as const satisfies readonly ConcoursType[]

type BiomedType = (typeof BIOMED_TYPES)[number]

const BIOMED_CONDITIONS: Record<BiomedType, string> = {
  BIOMED_L1: "Etre titulaire d'un Baccalaureat scientifique, d'un GCE Advanced Level scientifique ou d'un diplome equivalent.",
  BIOMED_L3: "Etre titulaire d'un diplome Bac+2 compatible avec les sciences biomedicales ou medico-sanitaires.",
  BIOMED_MASTER: "Etre titulaire d'une Licence compatible avec les sciences biomedicales ou medico-sanitaires.",
  BIOMED_MASTER_PRO: "Etre titulaire d'une Licence professionnelle ou d'un diplome equivalent, avec stage ou experience professionnelle appreciee.",
}

const BIOMED_PLACES: Record<BiomedType, number> = {
  BIOMED_L1: 180,
  BIOMED_L3: 60,
  BIOMED_MASTER: 50,
  BIOMED_MASTER_PRO: 40,
}

async function main() {
  const admin = await prisma.user.findFirst({
    where: { role: { in: ['SUPER_ADMIN', 'RESPONSABLE'] } },
    orderBy: { createdAt: 'asc' },
  })

  if (!admin) {
    throw new Error('Aucun administrateur trouve. Executez le seed principal ou creez un compte SUPER_ADMIN avant ce seed.')
  }

  console.log('Ajout des concours biomedical par niveau...')

  for (const type of BIOMED_TYPES) {
    const config = STAB_FORM_CONFIGS[type]

    await prisma.concours.upsert({
      where: { id: type.toLowerCase().replaceAll('_', '-') },
      update: {
        type,
        titre: config.title,
        description: config.subtitle,
        departement: config.departement,
        filieres: config.filieres,
        centres: config.centers,
        piecesRequises: config.documents.map((document) => document.label),
        nombrePlaces: BIOMED_PLACES[type],
        fraisInscription: 20000,
        conditionsAdmission: BIOMED_CONDITIONS[type],
        dateCloture: new Date('2026-08-30T17:00:00Z'),
        dateConcours: new Date('2026-09-10T08:00:00Z'),
        statut: ConcoursStatut.PUBLIE,
        isActive: true,
      },
      create: {
        id: type.toLowerCase().replaceAll('_', '-'),
        type,
        titre: config.title,
        description: config.subtitle,
        departement: config.departement,
        filieres: config.filieres,
        centres: config.centers,
        piecesRequises: config.documents.map((document) => document.label),
        nombrePlaces: BIOMED_PLACES[type],
        fraisInscription: 20000,
        conditionsAdmission: BIOMED_CONDITIONS[type],
        dateOuverture: new Date('2026-05-15T08:00:00Z'),
        dateCloture: new Date('2026-08-30T17:00:00Z'),
        dateConcours: new Date('2026-09-10T08:00:00Z'),
        statut: ConcoursStatut.PUBLIE,
        createdBy: admin.id,
        documentsRequis: {
          create: config.documents.map((document, index) => ({
            nom: document.label,
            ordre: index,
            obligatoire: document.required,
          })),
        },
      },
    })
  }

  console.log('Seed biomedical termine avec succes.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
