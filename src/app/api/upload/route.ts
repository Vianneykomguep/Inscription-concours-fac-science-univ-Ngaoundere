import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { uploadFile } from '@/lib/upload'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get('file') as File
    const subDir = (formData.get('subDir') as string) || 'general'

    if (!file) return NextResponse.json({ error: 'Fichier requis' }, { status: 400 })

    const result = await uploadFile(file, subDir)
    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 })
  }
}
