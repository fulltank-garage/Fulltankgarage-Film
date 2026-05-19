import { useEffect, useMemo, useState } from 'react'
import { FilmDetail } from './components/FilmDetail'
import { FilmGrid } from './components/FilmGrid'
import { getJson } from './lib/api'
import type { ApiFilm, Film } from './types/film'
import { mapApiFilm } from './utils/filmMapper'

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

export default App
