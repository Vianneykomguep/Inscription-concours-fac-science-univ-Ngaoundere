import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { hasPermission, Permission } from '@/lib/permissions'
import { CANDIDATURE_STATUT_LABELS } from '@/lib/utils'

type Row = Record<string, string | number | null>

export async function GET(request: Request) {
  const user = await getCurrentUser()
  if (!user || !hasPermission(user, Permission.MANAGE_USERS)) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
const kind = searchParams.get('kind') ?? 'candidatures'
const format = searchParams.get('format') ?? 'xlsx'
const concoursId = searchParams.get('concoursId') ?? undefined

  const rows = await getRows(kind, concoursId)
  const filename = `${kind}-${new Date().toISOString().slice(0, 10)}.${format === 'csv' ? 'csv' : 'xlsx'}`

  if (format === 'csv') {
    return new NextResponse(toCsv(rows), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  }

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Export')
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}

async function getRows(kind: string, concoursId?: string): Promise<Row[]> {
  if (kind === 'concours') {
    const concours = await prisma.concours.findMany({
      include: { _count: { select: { candidatures: true } } },
      orderBy: [{ departement: 'asc' }, { titre: 'asc' }],
    })

    return concours.map((item) => ({
      Departement: item.departement,
      Concours: item.titre,
      Niveau: item.type,
      Places: item.nombrePlaces,
      Candidatures: item._count.candidatures,
      Statut: item.statut,
        Actif: item.isActive ? 'Oui' : 'Non',
      Cloture: item.dateCloture.toISOString().slice(0, 10),
    }))
  }

  if (kind === 'resultats') {
    const resultats = await prisma.resultat.findMany({
      where: concoursId ? { concoursId } : undefined,
      include: { concours: true },
      orderBy: [{ concours: { departement: 'asc' } }, { rang: 'asc' }],
    })

    return resultats.map((item) => ({
      Departement: item.concours.departement,
      Concours: item.concours.titre,
      Numero: item.numeroDossier,
      Nom: item.nomComplet,
      Statut: item.statutFinal,
      Note: item.note ? Number(item.note) : null,
      Rang: item.rang,
        Publication: item.publishedAt?.toISOString().slice(0, 10) ?? '',
    }))
  }

  const candidatures = await prisma.candidature.findMany({
      where: concoursId ? { concoursId } : undefined,
    include: {
      concours: true,
      user: { select: { email: true } },
      paiements: true,
      documents: true,
      uploadedDocuments: true,
    },
    orderBy: [{ concours: { departement: 'asc' } }, { createdAt: 'desc' }],
  })

  return candidatures.map((item) => ({
    Departement: item.concours.departement,
    Concours: item.concours.titre,
    Niveau: item.type,
    Numero: item.numeroDossier,
    Nom: item.nom ?? '',
    Prenom: item.prenom ?? '',
    Email: item.user.email,
    Telephone: item.telephone ?? '',
    Filiere: item.filiere,
    Centre: item.centre,
        Statut: CANDIDATURE_STATUT_LABELS[item.statut] ?? item.statut,
    Documents: item.documents.length + item.uploadedDocuments.length,
    Paiements: item.paiements.length,
        Soumission: item.submittedAt?.toISOString().slice(0, 10) ?? item.createdAt.toISOString().slice(0, 10),
  }))
}

function toCsv(rows: Row[]) {
  if (rows.length === 0) return ''
  const headers = Object.keys(rows[0])
  const lines = rows.map((row) => headers.map((header) => csvCell(row[header])).join(';'))
  return [headers.join(';'), ...lines].join('\n')
}

function csvCell(value: Row[string]) {
  const raw = value === null || value === undefined ? '' : String(value)
  return `"${raw.replaceAll('"', '""')}"`
}
