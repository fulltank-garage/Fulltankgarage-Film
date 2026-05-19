import { ChevronLeft } from 'lucide-react'
import fulltankGarageLogo from '../assets/fulltank-garage-logo.jpg'
import type { Film } from '../types/film'

export function FilmDetail({ film, onBack }: { film: Film; onBack: () => void }) {
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
              className="h-11 w-11 shrink-0 rounded-xl object-contain shadow-[0_10px_24px_rgba(255,64,59,0.18)]"
              src={fulltankGarageLogo}
            />
            <h1 className="min-w-0 whitespace-nowrap text-center text-[clamp(0.92rem,4.25vw,1.55rem)] font-black leading-none text-white">
              {film.name}
            </h1>
          </div>
        </div>
      </nav>

      <article className="overflow-hidden rounded-[1.5rem] border border-white/12 bg-[#151515] shadow-[0_0_34px_rgba(255,30,26,0.18)]">
        <div className={`grid aspect-[16/9] place-items-center overflow-hidden bg-gradient-to-br ${film.gradient}`}>
          {film.imageUrl ? (
            <img alt="" className="max-h-full max-w-full object-contain" src={film.imageUrl} />
          ) : (
            <img
              alt="FULLTANK Garage"
              className="h-auto w-48 rounded-lg object-contain opacity-90"
              src={fulltankGarageLogo}
            />
          )}
        </div>

        <div className="p-4">
          <h1 className="text-3xl font-black leading-tight">{film.name}</h1>
        </div>

        <div className="mx-4 rounded-2xl border border-[#ff403b]/22 bg-[#ff403b]/8 p-4">
          <h2 className="text-sm font-black text-white">รายละเอียดฟิล์ม</h2>
          <p className="mt-2 whitespace-pre-line text-sm font-semibold leading-6 text-white/62">
            {film.description}
          </p>
        </div>

        {film.galleryImages.length ? (
          <section className="mx-4 mt-5">
            <div className="mt-3 grid gap-3">
              {film.galleryImages.map((imageUrl) => (
                <figure className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0d]" key={imageUrl}>
                  <img alt="" className="h-auto w-full object-contain" src={imageUrl} />
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {film.priceTableImageUrl ? (
          <section className="mx-4 mt-5">
            <h2 className="text-sm font-black text-white">ตารางราคาฟิล์ม</h2>
            <figure className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0d]">
              <img alt="ตารางราคาฟิล์ม" className="h-auto w-full object-contain" src={film.priceTableImageUrl} />
            </figure>
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
      </article>
    </>
  )
}
