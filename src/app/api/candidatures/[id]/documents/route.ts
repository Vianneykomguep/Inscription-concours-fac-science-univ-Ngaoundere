import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { uploadFile } from '@/lib/upload'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    const candidature = await prisma.candidature.findUnique({ where: { id: params.id } })
    if (!candidature || candidature.userId !== user.id) {
      return NextResponse.json({ error: 'Candidature non trouvée' }, { status: 404 })
    }
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string
    if (!file || !type) return NextResponse.json({ error: 'Fichier et type requis' }, { status: 400 })
    const uploaded = await uploadFile(file, `candidatures/${params.id}`)
    const doc = await prisma.candidatureDocument.create({
      data: {
        candidatureId: params.id, type,
        nomFichier: uploaded.fileName, url: uploaded.url,
        tailleFichier: uploaded.size, mimeType: uploaded.mimeType,
      },
    })
    return NextResponse.json(doc, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 })
  }
}
