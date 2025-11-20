import { promises as fs } from 'fs'
import path from 'path'

// Shared service store persisted to JSON file. Location configurable via DATA_DIR env var.
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

const DEFAULT_DATA_DIR = path.join(process.cwd(), 'data')
const DATA_DIR = process.env.DATA_DIR
  ? path.isAbsolute(process.env.DATA_DIR)
    ? process.env.DATA_DIR
    : path.resolve(process.cwd(), process.env.DATA_DIR)
  : DEFAULT_DATA_DIR
const FILE_PATH = path.join(DATA_DIR, 'services.json')

const DEFAULT_SERVICES: Service[] = [
  {
    id: '1',
    title: 'Real Estate Brokerage',
    description:
      'Expert assistance in buying and selling residential and commercial properties. We help you find the perfect property or sell your existing one at the best market value.',
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
    description:
      'Strategic advice for your real estate investments. Our consultants provide insights to help you make informed decisions about property investments.',
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
  },{
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

async function ensureFile() {
  try {
    await fs.access(FILE_PATH)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.writeFile(FILE_PATH, JSON.stringify(DEFAULT_SERVICES, null, 2), 'utf-8')
  }
}

export async function readServices(): Promise<Service[]> {
  await ensureFile()
  const file = await fs.readFile(FILE_PATH, 'utf-8')
  try {
    return JSON.parse(file) as Service[]
  } catch {
    return DEFAULT_SERVICES
  }
}

export async function writeServices(services: Service[]): Promise<void> {
  await ensureFile()
  await fs.writeFile(FILE_PATH, JSON.stringify(services, null, 2), 'utf-8')
}

export async function getServices(publishedOnly: boolean = false): Promise<Service[]> {
  const services = await readServices()
  return publishedOnly ? services.filter((s) => s.published) : services
}

export async function getServiceById(id: string): Promise<Service | undefined> {
  const services = await readServices()
  return services.find((s) => s.id === id)
}

export async function createService(
  service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Service> {
  const services = await readServices()
  const newService: Service = {
    id: Date.now().toString(),
    ...service,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  services.push(newService)
  await writeServices(services)
  return newService
}

export async function updateService(id: string, updates: Partial<Service>): Promise<Service | null> {
  const services = await readServices()
  const index = services.findIndex((s) => s.id === id)
  if (index === -1) return null
  services[index] = {
    ...services[index],
    ...updates,
    id,
    updatedAt: new Date().toISOString(),
  }
  await writeServices(services)
  return services[index]
}

export async function deleteService(id: string): Promise<boolean> {
  const services = await readServices()
  const filtered = services.filter((s) => s.id !== id)
  if (filtered.length === services.length) return false
  await writeServices(filtered)
  return true
}

