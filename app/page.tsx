'use client'

import { motion } from 'framer-motion'
import { Bath, Bed, Home, MapPin, Search, Shield, Square, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Property {
  id: string
  title: string
  location: string
  price: number
  bedrooms?: number
  bathrooms?: number
  area?: number
  status: string
  featured: boolean
  published: boolean
  images: string[]
}

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([])
  const [loadingProperties, setLoadingProperties] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoadingProperties(true)
        const origin = typeof window !== 'undefined' ? window.location.origin : ''
        const response = await fetch(`${origin}/api/properties?published=true`)
        if (!response.ok) {
          throw new Error('Failed to load properties.')
        }
        const data = await response.json()
        if (Array.isArray(data.properties)) {
          const featured = data.properties
            .filter((property: any) => property.published && property.featured)
            .slice(0, 3)
          setFeaturedProperties(featured)
        }
      } catch (error) {
        console.error('Failed to load featured properties', error)
        // Fallback data if API fails
        setFeaturedProperties([
          {
            id: '1',
            title: 'Modern Family Home',
            location: 'Downtown District',
            price: 450000,
            bedrooms: 4,
            bathrooms: 3,
            area: 2500,
            status: 'FOR_SALE',
            featured: true,
            published: true,
            images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'],
          },
          {
            id: '2',
            title: 'Luxury Apartment',
            location: 'City Center',
            price: 280000,
            bedrooms: 2,
            bathrooms: 2,
            area: 1200,
            status: 'FOR_RENT',
            featured: false,
            published: true,
            images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
          },
          {
            id: '3',
            title: 'Executive Villa',
            location: 'Suburban Area',
            price: 750000,
            bedrooms: 5,
            bathrooms: 4,
            area: 3500,
            status: 'BUY_PAY_LATER',
            featured: true,
            published: true,
            images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800'],
          },
        ])
      } finally {
        setLoadingProperties(false)
      }
    }

    fetchFeatured()
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      FOR_SALE: { label: 'For Sale', color: 'bg-green-600 text-white' },
      FOR_RENT: { label: 'For Rent', color: 'bg-accent text-white' },
      BUY_PAY_LATER: { label: 'Buy & Pay Later', color: 'bg-purple-600 text-white' },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.FOR_SALE
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
        {config.label}
      </span>
    )
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-surface-dark text-white flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-dark via-surface-dark-2 to-surface-dark"></div>
        <div className="relative w-full max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-32 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Find Your Perfect Property
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
              Your trusted partner in real estate brokerage and consultancy. Discover exceptional properties and expert guidance.
            </p>

            {/* Quick Search */}
            <div className="bg-white rounded-lg p-6 shadow-xl">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Search by location..."
                  className="flex-1 px-4 py-3 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <select className="px-4 py-3 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent bg-white">
                  <option>All Types</option>
                  <option>House</option>
                  <option>Apartment</option>
                  <option>Condo</option>
                  <option>Villa</option>
                </select>
                <button className="bg-accent hover:brightness-95 text-white px-8 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2">
                  <Search size={20} />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive real estate solutions tailored to your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Home size={32} />,
                title: 'Real Estate Brokerage',
                description: 'Expert assistance in buying and selling properties with the best deals.',
              },
              {
                icon: <TrendingUp size={32} />,
                title: 'Consultancy',
                description: 'Strategic advice for your real estate investments and decisions.',
              },
              {
                icon: <Shield size={32} />,
                title: 'Property Management',
                description: 'Comprehensive management services for your properties.',
              },
              {
                icon: <Users size={32} />,
                title: 'Project Advisory',
                description: 'Expert guidance for real estate development projects.',
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="text-accent mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/services" className="inline-block bg-accent hover:brightness-95 text-white px-8 py-3 rounded-lg font-semibold transition">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium properties
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingProperties && featuredProperties.length === 0 ? (
              <div className="col-span-full text-center text-gray-600">Loading featured properties...</div>
            ) : featuredProperties.length === 0 ? (
              <div className="col-span-full text-center text-gray-600">
                No featured properties available right now. Check back soon!
              </div>
            ) : (
              featuredProperties.map((property, index) => {
                const formattedPrice =
                  property.status === 'FOR_RENT'
                    ? `$${property.price.toLocaleString()}/mo`
                    : `$${property.price.toLocaleString()}`

                return (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-64 bg-gradient-to-br from-accent/10 to-accent/20 overflow-hidden">
                      <div className="absolute top-4 left-4 z-10">
                        {getStatusBadge(property.status)}
                      </div>
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home size={60} className="text-accent" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin size={18} className="mr-2 text-accent" />
                        <span>{property.location}</span>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-2xl font-bold text-accent">{formattedPrice}</p>
                        <div className="md:hidden">
                          {getStatusBadge(property.status)}
                        </div>
                      </div>
                      <div className="flex gap-4 text-gray-600 text-sm mb-4">
                        <div className="flex items-center">
                          <Bed size={18} className="mr-2 text-accent" />
                          <span>{property.bedrooms ?? 'N/A'} Beds</span>
                        </div>
                        <div className="flex items-center">
                          <Bath size={18} className="mr-2 text-accent" />
                          <span>{property.bathrooms ?? 'N/A'} Baths</span>
                        </div>
                        <div className="flex items-center">
                          <Square size={18} className="mr-2 text-accent" />
                          <span>{property.area ? `${property.area.toLocaleString()} sqft` : 'N/A'}</span>
                        </div>
                      </div>
                      <Link
                        href={`/properties/${property.id}`}
                        className="block w-full bg-accent hover:brightness-95 text-white text-center py-3 rounded-lg font-semibold transition"
                      >
                        View Details
                      </Link>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>

          <div className="text-center mt-12">
            <Link href="/properties" className="inline-block bg-accent hover:brightness-95 text-white px-8 py-3 rounded-lg font-semibold transition">
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-surface-dark text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Get in touch with our expert team today and let us help you find the perfect property
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-slate-900 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  )
}
