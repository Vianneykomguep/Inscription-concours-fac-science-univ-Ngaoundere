import { ConcoursStatut, PrismaClient } from '@prisma/client'
import { STAB_FORM_CONFIGS } from '../src/lib/stab-config'

const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.user.findFirst({
    where: { role: { in: ['SUPER_ADMIN', 'RESPONSABLE'] } },
    orderBy: { createdAt: 'asc' },
  })

  if (!admin) {
    throw new Error('Aucun administrateur trouve pour creer le concours IAA-MAF.')
  }

  const config = STAB_FORM_CONFIGS.IAA_MAF_M1
  const id = 'iaa-maf-m1-2026'
  const conditionsAdmission =
    "Etre titulaire d'une Licence scientifique ou professionnelle en informatique, informatique industrielle, technologies de l'information, mathematiques, mathematiques appliquees, physique electronique, econometrie, d'un diplome d'ingenieur ou de tout diplome reconnu equivalent par le Ministere de l'Enseignement Superieur."

  await prisma.concours.upsert({
    where: { id },
    update: {
      type: 'IAA_MAF_M1',
      titre: config.title,
      description: config.subtitle,
      departement: config.departement,
      filieres: config.filieres,
      centres: config.centers,
      piecesRequises: config.documents.map((document) => document.label),
      nombrePlaces: 40,
      fraisInscription: 20000,
      conditionsAdmission,
      dateOuverture: new Date('2026-04-17T08:00:00Z'),
      dateCloture: new Date('2026-09-30T17:00:00Z'),
      dateConcours: null,
      guideUrl: '/docs/Concours_IAA-MAF-2026.pdf',
      statut: ConcoursStatut.PUBLIE,
      isActive: true,
    },
    create: {
      id,
      type: 'IAA_MAF_M1',
      titre: config.title,
      description: config.subtitle,
      departement: config.departement,
      filieres: config.filieres,
      centres: config.centers,
      piecesRequises: config.documents.map((document) => document.label),
      nombrePlaces: 40,
      fraisInscription: 20000,
      conditionsAdmission,
      dateOuverture: new Date('2026-04-17T08:00:00Z'),
      dateCloture: new Date('2026-09-30T17:00:00Z'),
      dateConcours: null,
      guideUrl: '/docs/Concours_IAA-MAF-2026.pdf',
      statut: ConcoursStatut.PUBLIE,
      isActive: true,
      createdBy: admin.id,
    },
  })

  await prisma.concoursDocument.deleteMany({ where: { concoursId: id } })
  await prisma.concoursDocument.createMany({
    data: config.documents.map((document, index) => ({
      concoursId: id,
      nom: document.label,
      ordre: index + 1,
      obligatoire: document.required,
    })),
  })

  console.log('Concours IAA-MAF cree ou mis a jour:', id)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
