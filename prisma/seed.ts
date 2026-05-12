import { PrismaClient, UserRole, ConcoursStatut } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { STAB_FORM_CONFIGS } from '../src/lib/stab-config'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('admin123456', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@univ-ndere.cm' },
    update: {},
    create: {
      email: 'admin@univ-ndere.cm',
      passwordHash,
      firstName: 'Admin',
      lastName: 'Système',
      role: UserRole.SUPER_ADMIN,
      emailVerified: true,
    },
  })

  for (const config of Object.values(STAB_FORM_CONFIGS)) {
    await prisma.concours.upsert({
      where: { id: config.type.toLowerCase().replaceAll('_', '-') },
      update: {
        titre: config.title,
        description: config.subtitle,
        departement: 'STAB',
        filieres: config.filieres,
        centres: config.centers,
        piecesRequises: config.documents.map((document) => document.label),
      },
      create: {
        id: config.type.toLowerCase().replaceAll('_', '-'),
        type: config.type,
        titre: config.title,
        description: config.subtitle,
        departement: 'STAB',
        filieres: config.filieres,
        centres: config.centers,
        piecesRequises: config.documents.map((document) => document.label),
        nombrePlaces: 100,
        fraisInscription: 15000,
        dateOuverture: new Date(),
        dateCloture: new Date('2026-08-30'),
        dateConcours: new Date('2026-09-10'),
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

  console.log('Admin créé: admin@univ-ndere.cm / admin123456')
  console.log('Concours STAB créés')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
