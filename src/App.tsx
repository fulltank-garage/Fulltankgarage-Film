import { ArrowLeft, ChevronRight, Gauge, ShieldCheck, Sun } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { getJson } from './lib/api'

type Film = {
  slug: string
  name: string
  series: string
  summary: string
  description: string
  logo: string
  gradient: string
  specs: {
    label: string
    value: string
  }[]
  highlights: string[]
}

const films: Film[] = [
  {
    slug: 'ceramic-black',
    name: 'Ceramic Black',
    series: 'Premium Ceramic',
    summary: 'ฟิล์มเซรามิกโทนดำ คุมความร้อนสูง มองจากในรถชัดในเวลากลางวัน',
    description:
      'รุ่นยอดนิยมสำหรับรถใช้งานประจำวัน เน้นความเป็นส่วนตัว ลดแสงสะท้อน และยังคงมุมมองจากในห้องโดยสารให้สบายตา',
    logo: 'CB',
    gradient: 'from-[#ff312b] via-[#7e1110] to-[#151515]',
    specs: [
      { label: 'IRR', value: '95%' },
      { label: 'UV', value: '99%' },
      { label: 'VLT', value: '40 / 60' },
    ],
    highlights: ['สีดำเรียบ', 'ไม่รบกวนสัญญาณ', 'เหมาะกับรถใช้งานทุกวัน'],
  },
  {
    slug: 'crystal-clear',
    name: 'Crystal Clear',
    series: 'Clear Vision',
    summary: 'ฟิล์มใสลดร้อนสำหรับบานหน้า ให้ทัศนวิสัยชัดและลดไอแดด',
    description:
      'ออกแบบสำหรับลูกค้าที่ต้องการความโปร่งและความสบายตา เหมาะกับกระจกบานหน้าและรถที่ต้องการคงลุคเดิม',
    logo: 'CC',
    gradient: 'from-[#ff4b45] via-[#27364a] to-[#101318]',
    specs: [
      { label: 'IRR', value: '90%' },
      { label: 'UV', value: '99%' },
      { label: 'VLT', value: '70' },
    ],
    highlights: ['ใสสบายตา', 'ลดแสงสะท้อน', 'เหมาะกับบานหน้า'],
  },
  {
    slug: 'metal-guard',
    name: 'Metal Guard',
    series: 'Heat Reflective',
    summary: 'ฟิล์มสะท้อนความร้อนสูง เหมาะกับรถที่จอดกลางแดดบ่อย',
    description:
      'บาลานซ์ระหว่างความเข้ม การสะท้อนความร้อน และความทนทาน ใช้ได้ดีกับรถครอบครัวและรถเดินทางไกล',
    logo: 'MG',
    gradient: 'from-[#f03a34] via-[#4a4f58] to-[#111111]',
    specs: [
      { label: 'TSER', value: '68%' },
      { label: 'UV', value: '99%' },
      { label: 'VLT', value: '35 / 50' },
    ],
    highlights: ['กันร้อนจัด', 'ผิวเงาสปอร์ต', 'ทนทานต่อการใช้งาน'],
  },
  {
    slug: 'privacy-max',
    name: 'Privacy Max',
    series: 'Deep Shade',
    summary: 'ฟิล์มเข้มพิเศษสำหรับความเป็นส่วนตัวและลุคดุดัน',
    description:
      'เหมาะกับลูกค้าที่ต้องการความเป็นส่วนตัวสูงและภาพลักษณ์แดงดำแบบสปอร์ต ควรเลือกเปอร์เซ็นต์ตามกฎหมายและการใช้งานจริง',
    logo: 'PM',
    gradient: 'from-[#ff2f2b] via-[#2a0505] to-[#070707]',
    specs: [
      { label: 'IRR', value: '94%' },
      { label: 'UV', value: '99%' },
      { label: 'VLT', value: '20 / 40' },
    ],
    highlights: ['เข้มพิเศษ', 'ลุคสปอร์ต', 'เหมาะกับกระจกข้างและหลัง'],
  },
]

type ApiFilm = {
  slug: string
  name: string
  logo?: string
  summary?: string
  description?: string
  imageUrl?: string
}

const gradients = [
  'from-[#ff312b] via-[#7e1110] to-[#151515]',
  'from-[#ff4b45] via-[#27364a] to-[#101318]',
  'from-[#f03a34] via-[#4a4f58] to-[#111111]',
  'from-[#ff2f2b] via-[#2a0505] to-[#070707]',
]

const mapApiFilm = (film: ApiFilm, index: number): Film => ({
  slug: film.slug,
  name: film.name,
  series: 'FullTank Film',
  summary: film.summary || 'ข้อมูลฟิล์มจาก FullTank Garage',
  description: film.description || film.summary || 'รายละเอียดฟิล์ม',
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
    { label: 'IRR', value: '90%+' },
    { label: 'UV', value: '99%' },
    { label: 'TYPE', value: 'AUTO' },
  ],
  highlights: ['ข้อมูลจากระบบ Admin', 'เหมาะสำหรับลูกค้า LINE LIFF', 'สอบถามรุ่นเพิ่มเติมได้ที่ร้าน'],
})

function App() {
  const [filmItems, setFilmItems] = useState<Film[]>(films)
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const selectedFilm = useMemo(
    () => filmItems.find((film) => film.slug === selectedSlug) ?? null,
    [filmItems, selectedSlug],
  )

  useEffect(() => {
    let isMounted = true

    getJson<ApiFilm[]>('/public/films?public=true')
      .then((items) => {
        if (isMounted && items.length > 0) {
          setFilmItems(items.map(mapApiFilm))
        }
      })
      .catch(() => {
        if (isMounted) {
          setFilmItems(films)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main className="min-h-dvh bg-[#070707] px-4 py-5 text-white">
      <div className="mx-auto w-full max-w-3xl">
        {selectedFilm ? (
          <FilmDetail film={selectedFilm} onBack={() => setSelectedSlug(null)} />
        ) : (
          <FilmGrid films={filmItems} onSelect={setSelectedSlug} />
        )}
      </div>
    </main>
  )
}

function FilmGrid({
  films,
  onSelect,
}: {
  films: Film[]
  onSelect: (slug: string) => void
}) {
  return (
    <>
      <header className="mb-5">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#ff403b]">
          FullTank Film
        </p>
        <h1 className="mt-2 text-3xl font-black leading-tight">
          เลือกดูข้อมูลฟิล์ม
        </h1>
      </header>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {films.map((film) => (
          <button
            className="group min-h-44 rounded-[1.25rem] border border-white/12 bg-[#151515] p-3 text-left shadow-[0_0_28px_rgba(255,30,26,0.11)] transition active:scale-[0.98] sm:min-h-52"
            key={film.slug}
            onClick={() => onSelect(film.slug)}
            type="button"
          >
            <div
              className={`grid aspect-square place-items-center rounded-2xl bg-gradient-to-br ${film.gradient} shadow-inner`}
            >
              <span className="text-4xl font-black tracking-tight text-white">
                {film.logo}
              </span>
            </div>
            <div className="mt-3 flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-black">{film.name}</p>
                <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-white/55">
                  {film.summary}
                </p>
              </div>
              <ChevronRight className="mt-1 shrink-0 text-[#ff403b]" size={18} />
            </div>
          </button>
        ))}
      </section>
    </>
  )
}

function FilmDetail({ film, onBack }: { film: Film; onBack: () => void }) {
  return (
    <article className="rounded-[1.5rem] border border-white/12 bg-[#151515] p-4 shadow-[0_0_34px_rgba(255,30,26,0.18)]">
      <button
        className="mb-4 inline-flex h-10 items-center gap-2 rounded-xl border border-white/12 px-3 text-sm font-bold text-white/78"
        onClick={onBack}
        type="button"
      >
        <ArrowLeft size={17} />
        กลับ
      </button>

      <div className={`grid aspect-[16/10] place-items-center rounded-[1.25rem] bg-gradient-to-br ${film.gradient}`}>
        <div className="text-center">
          <p className="text-6xl font-black tracking-tight">{film.logo}</p>
          <p className="mt-2 text-sm font-black uppercase tracking-[0.28em] text-white/68">
            {film.series}
          </p>
        </div>
      </div>

      <h1 className="mt-5 text-3xl font-black">{film.name}</h1>
      <p className="mt-3 text-base font-semibold leading-7 text-white/68">
        {film.description}
      </p>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {film.specs.map((spec) => (
          <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-center" key={spec.label}>
            <p className="text-xs font-black text-[#ff4a45]">{spec.label}</p>
            <p className="mt-1 text-lg font-black">{spec.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-2">
        {film.highlights.map((item, index) => {
          const icons = [ShieldCheck, Sun, Gauge]
          const Icon = icons[index % icons.length]

          return (
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#101010] px-3 py-3" key={item}>
              <Icon className="text-[#ff403b]" size={19} />
              <span className="text-sm font-bold text-white/78">{item}</span>
            </div>
          )
        })}
      </div>
    </article>
  )
}

export default App
