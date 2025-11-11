import { NextResponse } from 'next/server'
import path from 'path'
import { mkdir, writeFile } from 'fs/promises'
import crypto from 'crypto'

export const runtime = 'nodejs'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_MIME_PREFIX = 'image/'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    const urls: string[] = []

    for (const file of files) {
      if (!(file instanceof File)) {
        continue
      }

      if (!file.type.startsWith(ALLOWED_MIME_PREFIX)) {
        return NextResponse.json(
          { error: `Unsupported file type for ${file.name}` },
          { status: 400 },
        )
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `${file.name} exceeds the 10MB limit` },
          { status: 400 },
        )
      }

      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const extensionFromName = path.extname(file.name)
      const inferredExtension = extensionFromName || `.${file.type.split('/')[1] ?? 'png'}`
      const safeExtension = inferredExtension.replace(/[^a-zA-Z0-9.]/g, '')

      const filename = `${Date.now()}-${crypto.randomUUID()}${safeExtension}`
      const filePath = path.join(uploadDir, filename)

      await writeFile(filePath, buffer)
      urls.push(`/uploads/${filename}`)
    }

    return NextResponse.json({ urls })
  } catch (error) {
    console.error('[UPLOAD_ERROR]', error)
    return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 })
  }
}

