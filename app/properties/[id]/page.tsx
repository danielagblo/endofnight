'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MapPin, Bed, Bath, Square, Home, ArrowLeft, Phone, Mail, ChevronLeft, ChevronRight, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Property {
  id: string
  title: string
  description: string
  price: number
  propertyType: string
  status: string
  location: string
  address: string
  city: string
  state: string
  zipCode: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  images: string[]
  featured: boolean
  published: boolean
}

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  useEffect(() => {
    const fetchProperty = async () => {
      if (!params.id) return
      try {
        setLoading(true)
        const response = await fetch(`/api/properties/${params.id}`)
        if (!response.ok) {
          throw new Error('Unable to load property details.')
        }
        const data = await response.json()
        setProperty(data.property)
      } catch (error) {
        console.error('Error fetching property:', error)
        setProperty(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [params.id])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      FOR_SALE: { label: 'For Sale', color: 'bg-green-600 text-white' },
      FOR_RENT: { label: 'For Rent', color: 'bg-blue-600 text-white' },
      BUY_PAY_LATER: { label: 'Buy & Pay Later', color: 'bg-purple-600 text-white' },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.FOR_SALE
    return (
      <span className={`inline-block px-4 py-2 rounded-full text-base font-semibold ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getStatusDisplay = (status: string) => {
    const statusMap = {
      FOR_SALE: 'For Sale',
      FOR_RENT: 'For Rent',
      BUY_PAY_LATER: 'Buy & Pay Later',
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  const getTypeDisplay = (type: string) => {
    const typeMap: Record<string, string> = {
      HOUSE: 'House',
      APARTMENT: 'Apartment',
      CONDO: 'Condo',
      VILLA: 'Villa',
      LAND: 'Land',
      OFFICE_RENTAL: 'Office Rental',
    }
    return typeMap[type] || type
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">The property you're looking for doesn't exist.</p>
          <Link
            href="/properties"
            className="inline-block bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Properties
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Properties</span>
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold">{property.title}</h1>
            {getStatusBadge(property.status)}
          </div>
          <p className="text-xl text-slate-300">{property.location}</p>
        </div>
      </section>

      {/* Property Details */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                {property.images && property.images.length > 0 ? (
                  <div className="relative">
                    {/* Main Image */}
                    <div className="relative h-96 bg-gray-100">
                      <img
                        src={property.images[selectedImageIndex]}
                        alt={property.title}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setIsImageModalOpen(true)}
                      />
                      {property.images.length > 1 && (
                        <>
                          {/* Previous Button */}
                          {selectedImageIndex > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedImageIndex(selectedImageIndex - 1)
                              }}
                              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                            >
                              <ChevronLeft size={24} />
                            </button>
                          )}
                          {/* Next Button */}
                          {selectedImageIndex < property.images.length - 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedImageIndex(selectedImageIndex + 1)
                              }}
                              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                            >
                              <ChevronRight size={24} />
                            </button>
                          )}
                          {/* Image Counter */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                            {selectedImageIndex + 1} / {property.images.length}
                          </div>
                        </>
                      )}
                    </div>
                    {/* Thumbnail Grid */}
                    {property.images.length > 1 && (
                      <div className="grid grid-cols-5 gap-2 p-4 bg-gray-50">
                        {property.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                              selectedImageIndex === index
                                ? 'border-blue-600 scale-105'
                                : 'border-transparent hover:border-gray-300'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`${property.title} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-96 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <Home size={100} className="text-blue-600" />
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Description</h2>
                <p className="text-lg text-gray-600 leading-relaxed">{property.description}</p>
              </div>

              {/* Property Details */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {property.propertyType !== 'LAND' && property.propertyType !== 'OFFICE_RENTAL' && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Bed size={20} className="text-blue-600" />
                        <span className="font-semibold">Bedrooms</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{property.bedrooms || 'N/A'}</p>
                    </div>
                  )}
                  {property.propertyType !== 'LAND' && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Bath size={20} className="text-blue-600" />
                        <span className="font-semibold">Bathrooms</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{property.bathrooms || 'N/A'}</p>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Square size={20} className="text-blue-600" />
                      <span className="font-semibold">{property.propertyType === 'LAND' ? 'Plot Size' : 'Area'}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {property.area && property.area > 0
                        ? `${property.area.toLocaleString()} sqft`
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Home size={20} className="text-blue-600" />
                      <span className="font-semibold">Type</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {getTypeDisplay(property.propertyType)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Price Card */}
              <div className="bg-white rounded-lg shadow-md p-8 mb-6 sticky top-20">
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-blue-600 mb-2">
                    {property.propertyType === 'OFFICE_RENTAL' || property.status === 'FOR_RENT' 
                      ? `$${property.price.toLocaleString()}/mo`
                      : `$${property.price.toLocaleString()}`}
                  </p>
                  <div className="mb-4">
                    {getStatusBadge(property.status)}
                  </div>
                  <p className="text-gray-600 text-sm">Status: {getStatusDisplay(property.status)}</p>
                  {property.propertyType === 'LAND' && property.area && property.area > 0 && (
                    <p className="text-gray-500 text-xs mt-2">
                      Price per sqft: ${(property.price / property.area).toFixed(2)}
                    </p>
                  )}
                </div>
                <div className="space-y-4">
                  <button className="w-full bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                    <Phone size={20} />
                    <span>Contact Agent</span>
                  </button>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                    <Mail size={20} />
                    <span>Schedule Viewing</span>
                  </button>
                </div>
              </div>

              {/* Location Card */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Location</h3>
                <div className="flex items-start gap-3 text-gray-600">
                  <MapPin size={20} className="text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">{property.address}</p>
                    <p>{property.city}, {property.state} {property.zipCode}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {isImageModalOpen && property.images && property.images.length > 0 && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X size={32} />
          </button>
          {property.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImageIndex(
                    selectedImageIndex > 0
                      ? selectedImageIndex - 1
                      : property.images.length - 1
                  )
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors z-10"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImageIndex(
                    selectedImageIndex < property.images.length - 1
                      ? selectedImageIndex + 1
                      : 0
                  )
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors z-10"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}
          <div className="max-w-7xl w-full h-full flex items-center justify-center">
            <img
              src={property.images[selectedImageIndex]}
              alt={property.title}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
            {selectedImageIndex + 1} / {property.images.length}
          </div>
        </div>
      )}
    </div>
  )
}

