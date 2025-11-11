import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

/**
 * Cloudinary uploader route
 *
 * Environment variables (see .env.local.example):
 * - CLOUDINARY_CLOUD_NAME
 * - CLOUDINARY_API_KEY
 * - CLOUDINARY_API_SECRET
 * - CLOUDINARY_UPLOAD_PRESET (optional - if present, unsigned upload will be used)
 * - CLOUDINARY_UPLOAD_FOLDER (optional)
 */

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_MIME_PREFIX = 'image/'

function sha1(input: string) {
  return crypto.createHash('sha1').update(input).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()
    const files = form.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET
    const uploadFolder = process.env.CLOUDINARY_UPLOAD_FOLDER

    if (!cloudName) {
      return NextResponse.json({ error: 'Missing CLOUDINARY_CLOUD_NAME env' }, { status: 500 })
    }

    const urls: string[] = []

    for (const file of files) {
      if (!(file instanceof File)) continue

      if (!file.type.startsWith(ALLOWED_MIME_PREFIX)) {
        return NextResponse.json({ error: `Unsupported file type for ${file.name}` }, { status: 400 })
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: `${file.name} exceeds the 10MB limit` }, { status: 400 })
      }

      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Build form data to send to Cloudinary.
      const cloudUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
      const fd = new FormData()

      // Append file as Blob
      const blob = new Blob([buffer], { type: file.type })
      fd.append('file', blob, file.name)

      if (uploadFolder) fd.append('folder', uploadFolder)

      if (uploadPreset) {
        // Use unsigned upload with preset
        fd.append('upload_preset', uploadPreset)
      } else {
        // Signed upload - requires apiKey and apiSecret
        if (!apiKey || !apiSecret) {
          return NextResponse.json({ error: 'Missing Cloudinary API credentials' }, { status: 500 })
        }

        const timestamp = Math.floor(Date.now() / 1000)
        // Build string to sign. For our use-case only timestamp and folder (if present) are included.
        // Be careful: cloudinary requires params sorted by key in lexicographical order when composing string_to_sign.
        const paramsToSign: Record<string, string | number> = { timestamp }
        if (uploadFolder) paramsToSign.folder = uploadFolder

        const sorted = Object.keys(paramsToSign).sort()
        const stringToSign = sorted.map((k) => `${k}=${paramsToSign[k]}`).join('&')
        const signature = sha1(stringToSign + apiSecret)

        fd.append('api_key', apiKey)
        fd.append('timestamp', String(timestamp))
        fd.append('signature', signature)
      }

      const res = await fetch(cloudUrl, { method: 'POST', body: fd })
      if (!res.ok) {
        const body = await res.text().catch(() => '')
        console.error('[CLOUDINARY_UPLOAD_ERROR]', res.status, body)
        return NextResponse.json({ error: `Cloudinary upload failed for ${file.name}` }, { status: 502 })
      }

      const body = await res.json()
      if (!body || !body.secure_url) {
        console.error('[CLOUDINARY_UPLOAD_NO_URL]', body)
        return NextResponse.json({ error: 'Cloudinary did not return a secure_url' }, { status: 502 })
      }

      urls.push(body.secure_url)
    }

    return NextResponse.json({ urls })
  } catch (error) {
    console.error('[UPLOAD_ERROR]', error)
    return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 })
  }
}

