export type PropertyStatus = 'FOR_SALE' | 'FOR_RENT' | 'BUY_PAY_LATER'
export type PropertyType =
  | 'HOUSE'
  | 'APARTMENT'
  | 'CONDO'
  | 'VILLA'
  | 'LAND'
  | 'OFFICE_RENTAL'

export interface Property {
  id: string
  title: string
  description: string
  price: number
  propertyType: PropertyType
  status: PropertyStatus
  location: string
  address: string
  city: string
  state: string
  zipCode: string
  bedrooms?: number
  bathrooms?: number
  area: number
  featured: boolean
  published: boolean
  images: string[]
  createdAt: string
  updatedAt: string
}


