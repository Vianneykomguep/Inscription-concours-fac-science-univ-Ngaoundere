import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const UPLOAD_DIR = process.env.UPLOAD_DIR || './public/uploads'
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880')

const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg', 'image/png', 'image/jpg',
]

export async function uploadFile(file: File, subDir: string = 'documents'): Promise<{ url: string; fileName: string; size: number; mimeType: string }> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Fichier trop volumineux. Maximum: ${MAX_FILE_SIZE / 1024 / 1024} Mo`)
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Type de fichier non autorisé. Formats acceptés: PDF, JPG, PNG')
  }

  const ext = file.name.split('.').pop()
  const fileName = `${uuidv4()}.${ext}`
  const dirPath = path.join(UPLOAD_DIR, subDir)
  await mkdir(dirPath, { recursive: true })

  const buffer = Buffer.from(await file.arrayBuffer())
  const filePath = path.join(dirPath, fileName)
  await writeFile(filePath, buffer)

  return {
    url: `/uploads/${subDir}/${fileName}`,
    fileName: file.name,
    size: file.size,
    mimeType: file.type,
  }
}
