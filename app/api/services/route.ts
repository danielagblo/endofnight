import { auth } from '@/lib/auth'
import { createService, getServices } from '@/lib/services-store'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')

    // Public access for published services, admin for all
    if (!session && published !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const services = await getServices(published === 'true')
    return NextResponse.json(services)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const newService = await createService({
      title: body.title,
      description: body.description,
      icon: body.icon || 'briefcase',
      published: body.published !== undefined ? body.published : true,
      features: body.features || [],
    })

    return NextResponse.json(newService, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }
}

