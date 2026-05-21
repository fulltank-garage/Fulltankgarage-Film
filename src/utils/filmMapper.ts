import { resolveImageUrl } from '../lib/api'
import type { ApiFilm, Film } from '../types/film'

const gradients = [
  'from-[#C0392B] via-[#C0392B] to-[#151515]',
  'from-[#C0392B] via-[#27364a] to-[#101318]',
  'from-[#C0392B] via-[#4a4f58] to-[#111111]',
  'from-[#C0392B] via-[#080205] to-[#080205]',
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
})
