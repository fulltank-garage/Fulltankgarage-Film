import { resolveImageUrl } from '../lib/api'
import type { ApiFilm, Film } from '../types/film'

const gradients = [
  'from-[#ff312b] via-[#7e1110] to-[#151515]',
  'from-[#ff4b45] via-[#27364a] to-[#101318]',
  'from-[#f03a34] via-[#4a4f58] to-[#111111]',
  'from-[#ff2f2b] via-[#2a0505] to-[#070707]',
]

export const mapApiFilm = (film: ApiFilm, index: number): Film => ({
  id: film.id,
  slug: film.slug,
  name: film.name,
  series: 'FULLTANK Film',
  summary: film.summary || 'ข้อมูลฟิล์มจาก FULLTANK Garage',
  description: film.description || film.summary || 'รายละเอียดฟิล์ม',
  imageUrl: resolveImageUrl(film.imageUrl),
  priceTableImageUrl: resolveImageUrl(film.priceTableImageUrl),
  galleryImages: (film.galleryImages ?? []).map(resolveImageUrl),
  irr: film.irr?.trim() || '90%+',
  uvProtection: film.uvProtection?.trim() || '99%',
  vlt: film.vlt?.trim() || '40%',
  tser: film.tser?.trim() || '60%+',
  vlr: film.vlr?.trim() || 'ต่ำ',
  filmType: film.filmType?.trim() || 'AUTO',
  vehicleType: film.vehicleType?.trim() || 'รถยนต์',
  installPosition: film.installPosition?.trim() || 'บานหน้า / รอบคัน',
  highlights: film.highlights?.length
    ? film.highlights
    : ['ฟิล์มรถยนต์เซรามิก', 'มองชัดทั้งกลางวันและกลางคืน', 'ไม่รบกวน GPS และ Easy Pass'],
  logo:
    film.logo ||
    film.name
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
  gradient: gradients[index % gradients.length],
  specs: [
    { label: 'IRR', value: film.irr?.trim() || '90%+' },
    { label: 'UV', value: film.uvProtection?.trim() || '99%' },
    { label: 'VLT', value: film.vlt?.trim() || '40%' },
    { label: 'TSER', value: film.tser?.trim() || '60%+' },
    { label: 'VLR', value: film.vlr?.trim() || 'ต่ำ' },
    { label: 'TYPE', value: film.filmType?.trim() || 'AUTO' },
  ],
})
