import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { deleteProperty, findPropertyById, updateProperty } from '@/lib/propertyStore'

export const runtime = 'nodejs'

type RouteParams = {
  params: {
    id: string
  }
}

export async function GET(_: Request, { params }: RouteParams) {
  const property = await findPropertyById(params.id)
  if (!property) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 })
  }
  return NextResponse.json({ property })
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await auth()

  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const updates = await request.json()
    const updated = await updateProperty(params.id, updates)
    if (!updated) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    return NextResponse.json({ property: updated })
  } catch (error) {
    console.error('[PROPERTIES_PUT_ERROR]', error)
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: RouteParams) {
  const session = await auth()

  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const deleted = await deleteProperty(params.id)
    if (!deleted) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[PROPERTIES_DELETE_ERROR]', error)
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 })
  }
}


