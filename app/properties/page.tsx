'use client'

import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Search, MapPin, Bed, Bath, Square, Home } from 'lucide-react'
import Link from 'next/link'

interface Property {
  id: string
  title: string
  location: string
  price: number
  bedrooms?: number
  bathrooms?: number
  area: number
  propertyType: string
  status: string
  featured: boolean
  images: string[]
}

export default function PropertiesPage() {
  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    status: '',
  })
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/properties')
        if (!response.ok) {
          throw new Error('Failed to load properties.')
        }
        const data = await response.json()
        const items: Property[] = Array.isArray(data.properties)
          ? data.properties.map((property: any) => ({
              id: property.id,
              title: property.title,
              location: property.location,
              price: property.price,
              bedrooms: property.bedrooms ?? undefined,
              bathrooms: property.bathrooms ?? undefined,
              area: property.area,
              propertyType: property.propertyType,
              status: property.status,
              featured: property.featured,
              images: Array.isArray(property.images) ? property.images : [],
            }))
          : []
        setProperties(items)
      } catch (error) {
        console.error('Failed to load properties', error)
        setError(error instanceof Error ? error.message : 'Failed to load properties.')
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesLocation = filters.location
        ? property.location.toLowerCase().includes(filters.location.toLowerCase())
        : true
      const matchesType = filters.propertyType
        ? property.propertyType === filters.propertyType.toUpperCase()
        : true
      const matchesStatus = filters.status ? property.status === filters.status : true
      const matchesMinPrice = filters.minPrice ? property.price >= Number(filters.minPrice) : true
      const matchesMaxPrice = filters.maxPrice ? property.price <= Number(filters.maxPrice) : true
      return matchesLocation && matchesType && matchesStatus && matchesMinPrice && matchesMaxPrice
    })
  }, [properties, filters])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      FOR_SALE: { label: 'For Sale', color: 'bg-green-600 text-white' },
      FOR_RENT: { label: 'For Rent', color: 'bg-blue-600 text-white' },
      BUY_PAY_LATER: { label: 'Buy & Pay Later', color: 'bg-purple-600 text-white' },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.FOR_SALE
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Filter handled reactively; this handler keeps form submit from reloading the page.
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Browse Properties</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Discover your perfect property from our extensive collection
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white shadow-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filters.propertyType}
              onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">All Types</option>
              <option value="HOUSE">House</option>
              <option value="APARTMENT">Apartment</option>
              <option value="CONDO">Condo</option>
              <option value="VILLA">Villa</option>
              <option value="LAND">Land</option>
              <option value="OFFICE_RENTAL">Office Rental</option>
            </select>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">All Status</option>
              <option value="FOR_SALE">For Sale</option>
              <option value="FOR_RENT">For Rent</option>
              <option value="BUY_PAY_LATER">Buy & Pay Later</option>
            </select>
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSearch}
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <Search size={20} />
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          {loading ? (
            <div className="text-center py-12 text-gray-600">Loading properties...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">{error}</div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              No properties matched your search. Try adjusting your filters or check back later.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative h-64 bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden">
                  <div className="absolute top-4 left-4 z-10">
                    {getStatusBadge(property.status)}
                  </div>
                  {property.featured && (
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                      Featured
                    </div>
                  )}
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home size={60} className="text-blue-600" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin size={18} className="mr-2 text-blue-600" />
                    <span>{property.location}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-2xl font-bold text-blue-600">
                      ${property.price.toLocaleString()}
                    </p>
                    <div className="md:hidden">
                      {getStatusBadge(property.status)}
                    </div>
                  </div>
                  <div className="flex gap-4 text-gray-600 text-sm mb-4 flex-wrap">
                  {property.propertyType !== 'LAND' && property.propertyType !== 'OFFICE_RENTAL' && (
                      <>
                        <div className="flex items-center">
                          <Bed size={18} className="mr-2 text-blue-600" />
                        <span>{property.bedrooms ?? 0} Beds</span>
                        </div>
                        <div className="flex items-center">
                          <Bath size={18} className="mr-2 text-blue-600" />
                        <span>{property.bathrooms ?? 0} Baths</span>
                        </div>
                      </>
                    )}
                  {property.propertyType === 'OFFICE_RENTAL' && (property.bathrooms ?? 0) > 0 && (
                      <div className="flex items-center">
                        <Bath size={18} className="mr-2 text-blue-600" />
                      <span>{property.bathrooms} Baths</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Square size={18} className="mr-2 text-blue-600" />
                      <span>{property.area.toLocaleString()} sqft</span>
                    </div>
                  </div>
                  <Link
                    href={`/properties/${property.id}`}
                    className="block w-full bg-slate-900 hover:bg-slate-800 text-white text-center py-3 rounded-lg font-semibold transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
