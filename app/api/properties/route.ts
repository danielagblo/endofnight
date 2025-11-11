import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { auth } from '@/lib/auth'
import { addProperty, readProperties } from '@/lib/propertyStore'
import { Property } from '@/types/property'

export const runtime = 'nodejs'

export async function GET() {
  const properties = await readProperties()
  return NextResponse.json({ properties })
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await request.json()

    const requiredFields = [
      'title',
      'description',
      'price',
      'propertyType',
      'status',
      'location',
      'address',
      'city',
      'state',
      'zipCode',
      'area',
    ]

    for (const field of requiredFields) {
      if (!payload[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const now = new Date().toISOString()

    const property: Property = {
      id: crypto.randomUUID(),
      title: String(payload.title),
      description: String(payload.description),
      price: Number(payload.price),
      propertyType: payload.propertyType,
      status: payload.status,
      location: String(payload.location),
      address: String(payload.address),
      city: String(payload.city),
      state: String(payload.state),
      zipCode: String(payload.zipCode),
      bedrooms: payload.bedrooms !== undefined && payload.bedrooms !== null ? Number(payload.bedrooms) : undefined,
      bathrooms: payload.bathrooms !== undefined && payload.bathrooms !== null ? Number(payload.bathrooms) : undefined,
      area: Number(payload.area),
      featured: Boolean(payload.featured),
      published: Boolean(payload.published),
      images: Array.isArray(payload.images) ? payload.images : [],
      createdAt: now,
      updatedAt: now,
    }

    await addProperty(property)

    return NextResponse.json({ property }, { status: 201 })
  } catch (error) {
    console.error('[PROPERTIES_POST_ERROR]', error)
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

// Mock data store (replace with database)
let properties: any[] = []

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')

    // Public access for published properties, admin for all
    if (!session && published !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let filteredProperties = properties
    if (published === 'true') {
      filteredProperties = properties.filter(p => p.published)
    }

    return NextResponse.json(filteredProperties)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const newProperty = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    properties.push(newProperty)
    return NextResponse.json(newProperty, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 })
  }
}

