'use client'

import { motion } from 'framer-motion'
import { Building2, Target, Users, Award } from 'lucide-react'

export default function AboutPage() {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About End of Night Company</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Your trusted partner in real estate brokerage and consultancy
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                End of Night Company was founded with a vision to revolutionize the real estate
                industry by providing exceptional service and unmatched expertise to our clients.
                We believe in building lasting relationships based on trust, transparency, and
                excellence.
              </p>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                Over the years, we have helped thousands of clients find their dream properties,
                navigate complex real estate transactions, and make informed investment decisions.
                Our team of experienced professionals is committed to delivering results that
                exceed expectations.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We combine deep market knowledge, innovative technology, and personalized service
                to provide solutions that work for you.
              </p>
            </div>
            <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center">
              <Building2 size={80} className="text-gray-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Mission & Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target size={32} />,
                title: 'Mission',
                description: 'To provide exceptional real estate services that help our clients achieve their property goals with confidence and ease.',
              },
              {
                icon: <Award size={32} />,
                title: 'Values',
                description: 'We are committed to integrity, excellence, and building long-term relationships with our clients.',
              },
              {
                icon: <Users size={32} />,
                title: 'Vision',
                description: 'To be the leading real estate company recognized for innovation, reliability, and outstanding client service.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-lg shadow-md text-center"
              >
                <div className="text-blue-600 mb-4 flex justify-center">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

