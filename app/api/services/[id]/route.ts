import { auth } from '@/lib/auth'
import { deleteService as deleteServiceFromStore, getServiceById, updateService } from '@/lib/services-store'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params
    const serviceId = id

    const service = await getServiceById(serviceId)

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    // Public can only see published services
    if (!session && !service.published) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(service)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const serviceId = id
    const body = await request.json()

    const updatedService = updateService(serviceId, body)

    if (!updatedService) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    return NextResponse.json(updatedService)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const serviceId = id
    const deleted = deleteServiceFromStore(serviceId)

    if (!deleted) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Service deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 })
  }
}

