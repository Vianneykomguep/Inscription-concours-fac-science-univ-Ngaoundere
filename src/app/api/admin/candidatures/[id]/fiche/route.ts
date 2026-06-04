import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { jsPDF } from 'jspdf'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { Permission, hasPermission } from '@/lib/permissions'
import { CANDIDATURE_STATUT_LABELS, formatCurrency, formatDate } from '@/lib/utils'
import { STAB_TYPE_LABELS } from '@/lib/stab-config'

const PAGE_WIDTH = 595
const PAGE_HEIGHT = 842
const MARGIN = 36
const GREEN = '#006633'
const GOLD = '#CC9900'
const TEXT = '#111827'
const MUTED = '#64748B'
const CARD_WIDTH = PAGE_WIDTH - MARGIN * 2

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user || !hasPermission(user, Permission.VIEW_CANDIDATURES)) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 403 })
  }

  const candidature = await prisma.candidature.findUnique({
    where: { id: params.id },
    include: {
      concours: true,
      user: true,
      documents: true,
      uploadedDocuments: true,
      resultats: true,
    },
  })

  if (!candidature) {
    return NextResponse.json({ error: 'Candidature introuvable' }, { status: 404 })
  }

  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const photo = candidature.uploadedDocuments.find((item) => item.type.toLowerCase().includes('photo'))
  let y = 292

  drawHeader(doc)
  drawPhoto(doc, photo?.fileUrl)
  drawBadge(doc, candidature.statut)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(19)
  doc.setTextColor(TEXT)
  doc.text(clean('Fiche officielle du candidat'), MARGIN, 124)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(MUTED)
  doc.text(clean(`Generee le ${formatDate(new Date())}`), MARGIN, 144)
  doc.setFontSize(9)
  doc.text(clean('Ce document reprend les informations administratives enregistrees dans le dossier de candidature.'), MARGIN, 164, {
    maxWidth: 330,
  })

  y = card(doc, y, 'Identification', [
    ['Numero dossier', candidature.numeroDossier ?? candidature.id],
    ['Nom complet', `${candidature.nom ?? ''} ${candidature.prenom ?? ''}`.trim() || `${candidature.user.firstName} ${candidature.user.lastName}`],
    ['Email', candidature.user.email],
    ['Telephone', candidature.telephone ?? candidature.user.phone ?? '-'],
    ['Naissance', `${candidature.dateNaissance ? formatDate(candidature.dateNaissance) : '-'} a ${candidature.lieuNaissance ?? '-'}`],
    ['Sexe', candidature.sexe ?? '-'],
    ['Nationalite', candidature.nationalite ?? '-'],
  ])

  y = card(doc, y, 'Concours sollicite', [
    ['Intitule', candidature.concours.titre],
    ['Departement', candidature.concours.departement],
    ['Niveau', STAB_TYPE_LABELS[candidature.concours.type] ?? candidature.concours.type],
    ['Filiere', candidature.filiere ?? '-'],
    ['Centre', candidature.centre ?? '-'],
    ['Frais', formatCurrency(Number(candidature.concours.fraisInscription))],
  ])

  y = card(doc, y, 'Suivi administratif', [
    ['Statut', CANDIDATURE_STATUT_LABELS[candidature.statut] ?? candidature.statut],
    ['Creation', formatDate(candidature.createdAt)],
    ['Soumission', candidature.soumisLe ? formatDate(candidature.soumisLe) : '-'],
    ['Complement demande', candidature.complementInfo ?? '-'],
    ['Motif rejet', candidature.motifRejet ?? '-'],
  ])

  y = card(doc, y, 'Parcours academique', [
    ['Dernier diplome', candidature.dernierDiplome ?? '-'],
    ['Etablissement', candidature.etablissement ?? '-'],
    ['Annee obtention', candidature.anneeObtention ? String(candidature.anneeObtention) : '-'],
    ['Mention', candidature.mention ?? '-'],
  ])

  const documents = [
    ...candidature.documents.map((item) => `${item.type} - ${item.nomFichier}`),
    ...candidature.uploadedDocuments.map((item) => `${item.type} - ${item.verified ? 'verifie' : 'en attente'}`),
  ]
  y = card(doc, y, 'Pieces deposees', documents.length ? documents.map((item, index) => [`${index + 1}`, item]) : [['-', 'Aucun document enregistre']])

  const result = candidature.resultats[0]
  if (result) {
    y = card(doc, y, 'Resultat publie', [
      ['Decision', result.statutFinal],
      ['Note', result.note ? Number(result.note).toFixed(2) : '-'],
      ['Rang', result.rang ? String(result.rang) : '-'],
      ['Publication', result.publishedAt ? formatDate(result.publishedAt) : '-'],
    ])
  }

  drawFooter(doc)

  const bytes = Buffer.from(doc.output('arraybuffer'))
  const filename = `fiche-candidat-${candidature.numeroDossier ?? candidature.id}.pdf`.replace(/[^\w.-]+/g, '-')

  return new NextResponse(bytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}

function drawHeader(doc: jsPDF) {
  doc.setFillColor(GREEN)
  doc.rect(0, 0, PAGE_WIDTH, 88, 'F')
  doc.setFillColor(GOLD)
  doc.rect(0, 88, PAGE_WIDTH, 5, 'F')

  addImage(doc, '/assets/logo-univ-ngaoundere.webp', 34, 18, 58, 58)
  addImage(doc, '/assets/logo-fac-sciences.webp', 503, 18, 58, 58)

  doc.setTextColor('#FFFFFF')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text(clean('UNIVERSITE DE NGAOUNDERE'), PAGE_WIDTH / 2, 32, { align: 'center' })
  doc.setFontSize(11)
  doc.text(clean('FACULTE DES SCIENCES'), PAGE_WIDTH / 2, 50, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(clean('Plateforme officielle des concours'), PAGE_WIDTH / 2, 68, { align: 'center' })
}

function drawPhoto(doc: jsPDF, url?: string) {
  const x = 438
  const y = 112
  const width = 118
  const height = 142

  doc.setDrawColor('#CBD5E1')
  doc.setFillColor('#FFFFFF')
  doc.roundedRect(x - 8, y - 8, width + 16, height + 28, 7, 7, 'FD')

  doc.setDrawColor('#CBD5E1')
  doc.setFillColor('#F8FAFC')
  doc.roundedRect(x, y, width, height, 5, 5, 'FD')

  if (url && addImage(doc, url, x + 5, y + 5, width - 10, height - 10)) return

  doc.setTextColor(MUTED)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('PHOTO', x + width / 2, y + height / 2, { align: 'center' })
}

function drawBadge(doc: jsPDF, statut: string) {
  const label = clean(CANDIDATURE_STATUT_LABELS[statut as keyof typeof CANDIDATURE_STATUT_LABELS] ?? statut)
  doc.setFillColor('#ECFDF5')
  doc.setDrawColor(GREEN)
  doc.roundedRect(MARGIN, 224, 210, 30, 5, 5, 'FD')
  doc.setTextColor(GREEN)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text(`Statut : ${label}`, MARGIN + 14, 243)
}

function card(doc: jsPDF, startY: number, title: string, rows: Array<[string, string]>) {
  const labelX = MARGIN + 18
  const valueX = MARGIN + 176
  const contentWidth = PAGE_WIDTH - valueX - MARGIN - 18
  const preparedRows = rows.map(([label, value]) => ({
    label,
    lines: doc.splitTextToSize(clean(String(value)), contentWidth) as string[],
  }))
  const rowHeights = preparedRows.map((row) => Math.max(24, row.lines.length * 13 + 8))
  const height = 42 + rowHeights.reduce((total, rowHeight) => total + rowHeight, 0) + 8
  let y = startY

  if (y + height > PAGE_HEIGHT - 60) {
    doc.addPage()
    y = MARGIN
  }

  doc.setFillColor('#FFFFFF')
  doc.setDrawColor('#E2E8F0')
  doc.roundedRect(MARGIN, y, CARD_WIDTH, height, 8, 8, 'FD')

  doc.setFillColor('#F0FDF4')
  doc.roundedRect(MARGIN, y, CARD_WIDTH, 32, 8, 8, 'F')
  doc.setTextColor(GREEN)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text(clean(title.toUpperCase()), MARGIN + 18, y + 21)

  let rowY = y + 52
  preparedRows.forEach((row, index) => {
    doc.setTextColor(MUTED)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.text(clean(row.label), labelX, rowY)

    doc.setTextColor(TEXT)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    doc.text(row.lines, valueX, rowY)

    rowY += rowHeights[index]
  })

  return y + height + 18
}

function drawFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages()
  for (let index = 1; index <= pageCount; index += 1) {
    doc.setPage(index)
    doc.setDrawColor('#E2E8F0')
    doc.line(MARGIN, PAGE_HEIGHT - 34, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 34)
    doc.setTextColor(MUTED)
    doc.setFontSize(8)
    doc.text(clean('Document etabli pour le suivi administratif des concours.'), MARGIN, PAGE_HEIGHT - 18)
    doc.text(`${index}/${pageCount}`, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 18, { align: 'right' })
  }
}

function addImage(doc: jsPDF, publicUrl: string, x: number, y: number, width: number, height: number) {
  const image = imageData(publicUrl)
  if (!image) return false

  try {
    doc.addImage(image.data, image.format, x, y, width, height)
    return true
  } catch {
    return false
  }
}

function imageData(publicUrl: string) {
  if (publicUrl.startsWith('data:image/')) {
    const [metadata, data] = publicUrl.split(',')
    if (!metadata || !data) return null

    const format = metadata.includes('image/png') ? 'PNG' : metadata.includes('image/webp') ? 'WEBP' : 'JPEG'
    return { data, format }
  }

  const cleanUrl = publicUrl.split('?')[0]
  const filePath = cleanUrl.startsWith('/uploads/')
    ? path.join(process.cwd(), 'public', cleanUrl)
    : path.join(process.cwd(), 'public', cleanUrl.replace(/^\//, ''))

  if (!fs.existsSync(filePath)) return null

  const ext = path.extname(filePath).toLowerCase()
  const format = ext === '.png' ? 'PNG' : ext === '.webp' ? 'WEBP' : 'JPEG'
  const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'
  const base64 = fs.readFileSync(filePath).toString('base64')

  return { data: `data:${mime};base64,${base64}`, format }
}

function clean(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
