import { ChevronRight } from 'lucide-react'
import fulltankGarageLogo from '../assets/fulltank-garage-logo.jpg'
import type { Film } from '../types/film'
import { EmptyState } from './FeedbackStates'

export function FilmGrid({
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
      <nav className="sticky top-0 z-20 -mx-4 mb-5 border-b border-white/10 bg-[#080205]/94 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-center gap-3">
          <img
            alt="FULLTANK Garage"
            className="h-11 w-11 shrink-0 rounded-xl object-cover shadow-[0_10px_24px_rgba(192,57,43,0.18)]"
            src={fulltankGarageLogo}
          />
          <h1 className="min-w-0 text-center text-[22px] font-black leading-none text-white">
            เลือกดูข้อมูลฟิล์ม
          </h1>
        </div>
      </nav>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {isLoading ? <FilmGridSkeleton /> : null}
        {!isLoading && films.length === 0 ? (
          <EmptyState
            className="col-span-2 sm:col-span-3"
            description="กลับมาเช็กข้อมูลฟิล์มจาก FULLTANK Garage ได้เร็วๆ นี้"
            title="ยังไม่มีข้อมูลฟิล์ม"
          />
        ) : null}
        {films.map((film) => (
          <button
            className="group min-h-44 rounded-[1.25rem] border border-white/12 bg-[#151515] p-3 text-left shadow-[0_0_28px_rgba(192,57,43,0.11)] transition active:scale-[0.98] sm:min-h-52"
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
                <img
                  alt=""
                  className="h-auto w-3/4 object-contain opacity-70"
                  src={fulltankGarageLogo}
                />
              )}
            </div>
            <div className="mt-3 flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <p className="break-words text-base font-black leading-snug">{film.name}</p>
              </div>
              <ChevronRight className="mt-1 shrink-0 text-[#C0392B]" size={18} />
            </div>
          </button>
        ))}
      </section>
    </>
  )
}

function FilmGridSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }, (_, index) => (
        <article
          aria-hidden="true"
          className="min-h-44 rounded-[1.25rem] border border-white/12 bg-[#151515] p-3 shadow-[0_0_28px_rgba(192,57,43,0.11)] sm:min-h-52"
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
