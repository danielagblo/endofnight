// Shared service store (replace with database in production)
export interface Service {
  id: string
  title: string
  description: string
  icon: string
  published: boolean
  features: string[]
  createdAt?: string
  updatedAt?: string
}

let services: Service[] = [
  {
    id: '1',
    title: 'Real Estate Brokerage',
    description: 'Expert assistance in buying and selling residential and commercial properties. We help you find the perfect property or sell your existing one at the best market value.',
    icon: 'house',
    published: true,
    features: [
      'Property listing and marketing',
      'Buyer and seller representation',
      'Market analysis and pricing',
      'Negotiation expertise',
      'Transaction management',
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Real Estate Consultancy',
    description: 'Strategic advice for your real estate investments. Our consultants provide insights to help you make informed decisions about property investments.',
    icon: 'trending-up',
    published: true,
    features: [
      'Investment strategy development',
      'Market trend analysis',
      'Property valuation',
      'Risk assessment',
      'Portfolio optimization',
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Property Management',
    description: 'Comprehensive property management services for landlords and property owners. We handle everything from tenant relations to maintenance.',
    icon: 'shield',
    published: true,
    features: [
      'Tenant screening and placement',
      'Rent collection',
      'Maintenance coordination',
      'Property inspections',
      'Financial reporting',
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Project Advisory',
    description: 'Expert guidance for real estate development projects. We help developers navigate the complexities of real estate projects from concept to completion.',
    icon: 'users',
    published: true,
    features: [
      'Project feasibility studies',
      'Site selection and analysis',
      'Development planning',
      'Regulatory compliance',
      'Project management support',
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Project Construction',
    description: 'Professional construction services for your real estate projects. We deliver high-quality construction solutions with expert craftsmanship and timely project completion.',
    icon: 'wrench',
    published: true,
    features: [
      'Construction planning and execution',
      'Quality assurance and control',
      'Timeline and budget management',
      'Skilled workforce coordination',
      'Safety compliance and standards',
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Materials Distribution',
    description: 'Efficient and reliable materials distribution services. We ensure timely delivery of construction materials to keep your projects on schedule.',
    icon: 'truck',
    published: true,
    features: [
      'Wide range of construction materials',
      'Timely delivery and logistics',
      'Quality material sourcing',
      'Inventory management',
      'Supply chain coordination',
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export function getServices(publishedOnly: boolean = false): Service[] {
  if (publishedOnly) {
    return services.filter(s => s.published)
  }
  return services
}

export function getServiceById(id: string): Service | undefined {
  return services.find(s => s.id === id)
}

export function createService(service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Service {
  const newService: Service = {
    id: Date.now().toString(),
    ...service,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  services.push(newService)
  return newService
}

export function updateService(id: string, updates: Partial<Service>): Service | null {
  const index = services.findIndex(s => s.id === id)
  if (index === -1) {
    return null
  }
  services[index] = {
    ...services[index],
    ...updates,
    id, // Ensure ID doesn't change
    updatedAt: new Date().toISOString(),
  }
  return services[index]
}

export function deleteService(id: string): boolean {
  const index = services.findIndex(s => s.id === id)
  if (index === -1) {
    return false
  }
  services.splice(index, 1)
  return true
}

