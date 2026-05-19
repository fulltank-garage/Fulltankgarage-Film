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
  filmType: string
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
  filmType?: string
}
