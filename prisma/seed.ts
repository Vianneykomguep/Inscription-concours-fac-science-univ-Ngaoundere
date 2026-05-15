import { PrismaClient, UserRole, ConcoursStatut } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { STAB_FORM_CONFIGS } from '../src/lib/stab-config'

const prisma = new PrismaClient()

const PLACES: Record<string, number> = {
  STAB_L1: 100,
  STAB_L3: 100,
  STAB_MASTER: 80,
  STAB_MASTER_PRO: 80,
  BIOMED_L1: 180,
  BIOMED_L3: 60,
  BIOMED_MASTER: 50,
  BIOMED_MASTER_PRO: 40,
}

const FRAIS: Record<string, number> = {
  STAB_L1: 15000,
  STAB_L3: 15000,
  STAB_MASTER: 20000,
  STAB_MASTER_PRO: 20000,
  BIOMED_L1: 20000,
  BIOMED_L3: 20000,
  BIOMED_MASTER: 25000,
  BIOMED_MASTER_PRO: 25000,
}

const CONDITIONS: Record<string, string> = {
  STAB_L1: 'Etre titulaire du Probatoire et du Baccalaureat ou GCE O/L et GCE A/L compatibles.',
  STAB_L3: 'Etre titulaire du Probatoire et du Baccalaureat ou GCE O/L et GCE A/L compatibles avec la specialite choisie.',
  STAB_MASTER: "Etre titulaire d'une Licence compatible avec les sciences et techniques de l'agriculture biologique.",
  STAB_MASTER_PRO: "Etre titulaire d'une Licence compatible avec les sciences et techniques de l'agriculture biologique.",
  BIOMED_L1: "Etre titulaire d'un Baccalaureat scientifique, d'un GCE Advanced Level scientifique ou d'un diplome equivalent.",
  BIOMED_L3: "Etre titulaire d'un diplome Bac+2 compatible avec les sciences biomedicales ou medico-sanitaires.",
  BIOMED_MASTER: "Etre titulaire d'une Licence compatible avec les sciences biomedicales ou medico-sanitaires.",
  BIOMED_MASTER_PRO: "Etre titulaire d'une Licence professionnelle ou d'un diplome equivalent, avec stage ou experience professionnelle appreciee.",
}

async function main() {
  const passwordHash = await bcrypt.hash('admin123456', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@univ-ndere.cm' },
    update: {},
    create: {
      email: 'admin@univ-ndere.cm',
      passwordHash,
      firstName: 'Admin',
      lastName: 'Systeme',
      role: UserRole.SUPER_ADMIN,
      emailVerified: true,
    },
  })

  await prisma.$transaction([
    prisma.resultat.deleteMany(),
    prisma.candidatureDocument.deleteMany(),
    prisma.uploadedDocument.deleteMany(),
    prisma.paiement.deleteMany(),
    prisma.message.deleteMany(),
    prisma.candidature.deleteMany(),
    prisma.concoursDocument.deleteMany(),
    prisma.concours.deleteMany(),
  ])

  for (const config of Object.values(STAB_FORM_CONFIGS)) {
    await prisma.concours.create({
      data: {
        id: config.type.toLowerCase().replaceAll('_', '-'),
        type: config.type,
        titre: config.title,
        description: config.subtitle,
        departement: config.departement,
        filieres: config.filieres,
        centres: config.centers,
        piecesRequises: config.documents.map((document) => document.label),
        nombrePlaces: PLACES[config.type],
        fraisInscription: FRAIS[config.type],
        conditionsAdmission: CONDITIONS[config.type],
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

  console.log('Admin cree: admin@univ-ndere.cm / admin123456')
  console.log('Anciens concours supprimes, 8 concours STAB/BIOMED recrees')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
