import { NextResponse } from 'next/server'
import { hasDatabaseUrl, prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  if (!hasDatabaseUrl) {
    return NextResponse.json({ error: 'Base de donnees non configuree' }, { status: 503 })
  }

  try {
    const concours = await prisma.concours.findUnique({
      where: { id: params.id },
      include: { documentsRequis: true, _count: { select: { candidatures: true } } },
    })
    if (!concours) return NextResponse.json({ error: 'Concours non trouvé' }, { status: 404 })
    return NextResponse.json(concours)
  } catch (error) {
    console.error('Get concours error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
