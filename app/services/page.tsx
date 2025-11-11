'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Home, TrendingUp, Shield, Users, Wrench, Truck, Briefcase } from 'lucide-react'
import Link from 'next/link'

interface Service {
  id: string
  title: string
  description: string
  icon: string
  published: boolean
  features: string[]
}

const iconMap: { [key: string]: React.ReactNode } = {
  house: <Home size={48} />,
  'trending-up': <TrendingUp size={48} />,
  shield: <Shield size={48} />,
  users: <Users size={48} />,
  wrench: <Wrench size={48} />,
  truck: <Truck size={48} />,
  briefcase: <Briefcase size={48} />,
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
    
    // Refresh services when page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchServices()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const fetchServices = async () => {
    try {
      // Add cache-busting to ensure fresh data
      const response = await fetch('/api/services?published=true', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Comprehensive real estate solutions tailored to your needs
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          {loading ? (
            <div className="text-center py-20">
              <div className="text-gray-600">Loading services...</div>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-600">No services available at the moment.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow border border-gray-100"
                >
                  <div className="text-blue-600 mb-6">
                    {iconMap[service.icon] || iconMap.briefcase}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{service.title}</h2>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-gray-700 leading-relaxed">
                        <span className="text-blue-600 mr-3 font-bold">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Contact us today to learn more about our services
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
