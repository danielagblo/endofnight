import { Property } from '@/types/property'
import { promises as fs } from 'fs'
import path from 'path'

// Allow overriding where data is stored via `DATA_DIR` env var.
// If `DATA_DIR` is relative, resolve it against the project cwd. If not set,
// fall back to the project's `data` directory.
const DEFAULT_DATA_DIR = path.join(process.cwd(), 'data')
const DATA_DIR = process.env.DATA_DIR
  ? path.isAbsolute(process.env.DATA_DIR)
    ? process.env.DATA_DIR
    : path.resolve(process.cwd(), process.env.DATA_DIR)
  : DEFAULT_DATA_DIR
const FILE_PATH = path.join(DATA_DIR, 'properties.json')

async function ensureFile() {
  try {
    await fs.access(FILE_PATH)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.writeFile(FILE_PATH, JSON.stringify([], null, 2), 'utf-8')
  }
}

export async function readProperties(): Promise<Property[]> {
  await ensureFile()
  const file = await fs.readFile(FILE_PATH, 'utf-8')
  return JSON.parse(file) as Property[]
}

export async function writeProperties(properties: Property[]): Promise<void> {
  await ensureFile()
  await fs.writeFile(FILE_PATH, JSON.stringify(properties, null, 2), 'utf-8')
}

export async function addProperty(property: Property): Promise<Property> {
  const properties = await readProperties()
  properties.push(property)
  await writeProperties(properties)
  return property
}

export async function findPropertyById(id: string): Promise<Property | undefined> {
  const properties = await readProperties()
  return properties.find((property) => property.id === id)
}

export async function updateProperty(id: string, updates: Partial<Property>): Promise<Property | null> {
  const properties = await readProperties()
  const index = properties.findIndex((property) => property.id === id)
  if (index === -1) {
    return null
  }

  const updated = { ...properties[index], ...updates, updatedAt: new Date().toISOString() }
  properties[index] = updated
  await writeProperties(properties)
  return updated
}

export async function deleteProperty(id: string): Promise<boolean> {
  const properties = await readProperties()
  const filtered = properties.filter((property) => property.id !== id)
  if (filtered.length === properties.length) {
    return false
  }

  await writeProperties(filtered)
  return true
}


