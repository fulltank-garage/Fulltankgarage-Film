export type Film = {
  id?: number
  slug: string
  name: string
  series: string
  summary: string
  description: string
  imageUrl?: string
  priceTableImageUrl?: string
  galleryImages: string[]
  irr: string
  uvProtection: string
  vlt: string
  tser: string
  vlr: string
  filmType: string
  vehicleType: string
  installPosition: string
  highlights: string[]
  logo: string
  gradient: string
  specs: {
    label: string
    value: string
  }[]
}

export type ApiFilm = {
  id?: number
  slug: string
  name: string
  logo?: string
  summary?: string
  description?: string
  imageUrl?: string
  priceTableImageUrl?: string
  galleryImages?: string[]
  irr?: string
  uvProtection?: string
  vlt?: string
  tser?: string
  vlr?: string
  filmType?: string
  vehicleType?: string
  installPosition?: string
  highlights?: string[]
  isActive?: boolean
}
