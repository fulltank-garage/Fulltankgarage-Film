import { ChevronLeft, ChevronRight, Gauge, ShieldCheck, Sun } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import fulltankGarageLogo from './assets/fulltank-garage-logo.jpg'
import { getJson } from './lib/api'

type Film = {
  id?: number
  slug: string
  name: string
  series: string
  summary: string
  description: string
  imageUrl?: string
  galleryImages: string[]
  logo: string
  gradient: string
  specs: {
    label: string
    value: string
  }[]
  highlights: string[]
}

type ApiFilm = {
  id?: number
  slug: string
  name: string
  logo?: string
  summary?: string
  description?: string
  imageUrl?: string
  galleryImages?: string[]
}

const gradients = [
  'from-[#ff312b] via-[#7e1110] to-[#151515]',
  'from-[#ff4b45] via-[#27364a] to-[#101318]',
  'from-[#f03a34] via-[#4a4f58] to-[#111111]',
  'from-[#ff2f2b] via-[#2a0505] to-[#070707]',
]

const mapApiFilm = (film: ApiFilm, index: number): Film => ({
  id: film.id,
  slug: film.slug,
  name: film.name,
  series: 'FULLTANK Film',
  summary: film.summary || 'ข้อมูลฟิล์มจาก FULLTANK Garage',
  description: film.description || film.summary || 'รายละเอียดฟิล์ม',
  imageUrl: film.imageUrl,
  galleryImages: film.galleryImages ?? [],
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
  highlights: ['คัดรุ่นฟิล์มสำหรับรถยนต์', 'ดูข้อมูลได้สะดวกผ่านมือถือ', 'สอบถามรุ่นเพิ่มเติมได้ที่ร้าน'],
})

function App() {
  const [filmItems, setFilmItems] = useState<Film[]>([])
  const [isLoadingFilms, setIsLoadingFilms] = useState(true)
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const selectedFilm = useMemo(
    () => filmItems.find((film) => film.slug === selectedSlug) ?? null,
    [filmItems, selectedSlug],
  )

  useEffect(() => {
    let isMounted = true

    getJson<ApiFilm[]>('/public/films?public=true')
      .then((items) => {
        if (!isMounted) {
          return
        }

        setFilmItems(items.map(mapApiFilm))
      })
      .catch(() => {
        if (isMounted) {
          setFilmItems([])
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingFilms(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main className="min-h-dvh bg-[#070707] px-4 pb-5 text-white">
      <div className="mx-auto w-full max-w-3xl">
        {selectedFilm ? (
          <FilmDetail film={selectedFilm} onBack={() => setSelectedSlug(null)} />
        ) : (
          <FilmGrid films={filmItems} isLoading={isLoadingFilms} onSelect={setSelectedSlug} />
        )}
      </div>
    </main>
  )
}

function FilmGrid({
  films,
  isLoading,
  onSelect,
}: {
  films: Film[]
  isLoading: boolean
  onSelect: (slug: string) => void
}) {
  return (
    <>
      <nav className="sticky top-0 z-20 -mx-4 mb-5 border-b border-white/10 bg-[#070707]/94 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-center gap-3">
          <img
            alt="FULLTANK Garage"
            className="h-11 w-11 shrink-0 rounded-xl object-cover shadow-[0_10px_24px_rgba(255,64,59,0.18)]"
            src={fulltankGarageLogo}
          />
          <h1 className="min-w-0 text-center text-[22px] font-black leading-none text-white">
            เลือกดูข้อมูลฟิล์ม
          </h1>
        </div>
      </nav>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {isLoading ? <FilmGridSkeleton /> : null}
        {!isLoading && films.length === 0 ? <EmptyFilmState /> : null}
        {films.map((film) => (
          <button
            className="group min-h-44 rounded-[1.25rem] border border-white/12 bg-[#151515] p-3 text-left shadow-[0_0_28px_rgba(255,30,26,0.11)] transition active:scale-[0.98] sm:min-h-52"
            key={film.id ?? film.slug}
            onClick={() => onSelect(film.slug)}
            type="button"
          >
            <div
              className={`grid aspect-square place-items-center overflow-hidden rounded-2xl bg-gradient-to-br ${film.gradient} shadow-inner`}
            >
              {film.imageUrl ? (
                <img alt="" className="size-full object-contain" src={film.imageUrl} />
              ) : (
                <span className="px-4 text-center text-sm font-black leading-5 text-white/72">
                  ตัวอย่างรูปภาพโลโก้
                </span>
              )}
            </div>
            <div className="mt-3 flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-black">{film.name}</p>
              </div>
              <ChevronRight className="mt-1 shrink-0 text-[#ff403b]" size={18} />
            </div>
          </button>
        ))}
      </section>
    </>
  )
}

function EmptyFilmState() {
  return (
    <div className="col-span-2 rounded-[1.25rem] border border-white/12 bg-[#151515] px-5 py-12 text-center shadow-[0_0_28px_rgba(255,30,26,0.11)] sm:col-span-3">
      <p className="text-xl font-black text-white">ยังไม่มีข้อมูลฟิล์ม</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-white/55">
        กลับมาเช็กข้อมูลฟิล์มจาก FULLTANK Garage ได้เร็วๆ นี้
      </p>
    </div>
  )
}

function FilmGridSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }, (_, index) => (
        <article
          aria-hidden="true"
          className="min-h-44 rounded-[1.25rem] border border-white/12 bg-[#151515] p-3 shadow-[0_0_28px_rgba(255,30,26,0.11)] sm:min-h-52"
          key={index}
        >
          <div className="aspect-square rounded-2xl skeleton-shimmer" />
          <div className="mt-3 flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <div className="h-5 w-4/5 rounded-xl skeleton-shimmer" />
            </div>
            <div className="mt-1 size-5 rounded-full skeleton-shimmer" />
          </div>
        </article>
      ))}
    </>
  )
}

function FilmDetail({ film, onBack }: { film: Film; onBack: () => void }) {
  return (
    <>
      <nav className="sticky top-0 z-20 -mx-4 mb-5 border-b border-white/10 bg-[#070707]/94 px-4 py-3 backdrop-blur">
        <div className="relative mx-auto flex min-h-11 w-full max-w-3xl items-center justify-center">
          <button
            aria-label="กลับไปหน้าเลือกฟิล์ม"
            className="absolute left-0 grid size-11 place-items-center rounded-xl border border-white/10 bg-white/5 text-white transition active:scale-95"
            onClick={onBack}
            type="button"
          >
            <ChevronLeft size={28} strokeWidth={2.6} />
          </button>
          <div className="flex min-w-0 items-center justify-center gap-3 px-12">
            <img
              alt="FULLTANK Garage"
              className="h-11 w-11 shrink-0 rounded-xl object-cover shadow-[0_10px_24px_rgba(255,64,59,0.18)]"
              src={fulltankGarageLogo}
            />
            <h1 className="min-w-0 truncate text-center text-[22px] font-black leading-none text-white">
              {film.name}
            </h1>
          </div>
        </div>
      </nav>

      <article className="overflow-hidden rounded-[1.5rem] border border-white/12 bg-[#151515] shadow-[0_0_34px_rgba(255,30,26,0.18)]">
        <div className={`grid aspect-[16/9] place-items-center overflow-hidden bg-gradient-to-br ${film.gradient}`}>
          {film.imageUrl ? (
            <img alt="" className="size-full object-contain" src={film.imageUrl} />
          ) : (
            <div className="px-5 text-center">
              <p className="text-lg font-black leading-7 text-white/78">ตัวอย่างรูปภาพโลโก้</p>
              <img
                alt="FULLTANK Garage"
                className="mx-auto mt-4 h-auto w-44 rounded-lg object-cover opacity-90"
                src={fulltankGarageLogo}
              />
            </div>
          )}
        </div>

        <div className="p-4">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ff6965]">FULLTANK FILM</p>
          <h1 className="mt-2 text-3xl font-black leading-tight">{film.name}</h1>
          <p className="mt-3 whitespace-pre-line text-base font-semibold leading-7 text-white/68">
            {film.summary}
          </p>
        </div>

        <div className="mx-4 rounded-2xl border border-[#ff403b]/22 bg-[#ff403b]/8 p-4">
          <h2 className="text-sm font-black text-white">
            รายละเอียดฟิล์ม
          </h2>
          <p className="mt-2 whitespace-pre-line text-sm font-semibold leading-6 text-white/62">
            {film.description}
          </p>
        </div>

        {film.galleryImages.length ? (
          <section className="mx-4 mt-5">
            <h2 className="text-sm font-black text-white">รูปภาพฟิล์ม</h2>
            <div className="mt-3 grid gap-3">
              {film.galleryImages.map((imageUrl) => (
                <figure className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0d]" key={imageUrl}>
                  <img alt="" className="h-auto w-full object-contain" src={imageUrl} />
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mx-4 mt-5 grid grid-cols-3 gap-2">
          {film.specs.map((spec) => (
            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-center" key={spec.label}>
              <p className="text-xs font-black text-[#ff4a45]">{spec.label}</p>
              <p className="mt-1 text-lg font-black">{spec.value}</p>
            </div>
          ))}
        </div>

        <div className="mx-4 mb-4 mt-5 space-y-2">
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
    </>
  )
}

export default App
