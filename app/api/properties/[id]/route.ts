import { auth } from '@/lib/auth'
import { deleteProperty, findPropertyById, updateProperty } from '@/lib/propertyStore'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

type RouteParams = {
  // Next.js may provide params as a Promise<{ id: string }>
  params: { id: string } | Promise<{ id: string }>
}

export async function GET(_: NextRequest, { params }: RouteParams) {
  const { id } = (await params) as { id: string }
  const property = await findPropertyById(id)
  if (!property) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 })
  }
  return NextResponse.json({ property })
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth()

  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
  const updates = await request.json()
  const { id } = (await params) as { id: string }
  const updated = await updateProperty(id, updates)
    if (!updated) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    return NextResponse.json({ property: updated })
  } catch (error) {
    console.error('[PROPERTIES_PUT_ERROR]', error)
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: RouteParams) {
  const session = await auth()

  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
  const { id } = (await params) as { id: string }
  const deleted = await deleteProperty(id)
    if (!deleted) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[PROPERTIES_DELETE_ERROR]', error)
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 })
  }
}


