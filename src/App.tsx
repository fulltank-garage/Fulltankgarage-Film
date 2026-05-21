import { useEffect, useMemo, useState } from 'react'
import { FilmDetail } from './components/FilmDetail'
import { FilmGrid } from './components/FilmGrid'
import { getJson, subscribeCatalogEvents } from './lib/api'
import type { ApiFilm, Film } from './types/film'
import { mapApiFilm } from './utils/filmMapper'

const getFilmKey = (film: Pick<Film, 'id' | 'slug'> | Pick<ApiFilm, 'id' | 'slug'>) =>
  film.id ? `id:${film.id}` : `slug:${film.slug}`

const upsertFilmItem = (items: Film[], nextApiFilm: ApiFilm) => {
  if (nextApiFilm.isActive === false) {
    return removeFilmItem(items, nextApiFilm.id ?? nextApiFilm.slug)
  }

  const nextKey = getFilmKey(nextApiFilm)
  const existingIndex = items.findIndex((item) => getFilmKey(item) === nextKey)
  const nextItem = mapApiFilm(nextApiFilm, existingIndex >= 0 ? existingIndex : 0)

  return [
    nextItem,
    ...items.filter((item) => getFilmKey(item) !== nextKey),
  ]
}

const removeFilmItem = (items: Film[], idOrSlug?: number | string) => {
  if (!idOrSlug) {
    return items
  }

  const targetID = String(idOrSlug)
  return items.filter(
    (item) => String(item.id ?? '') !== targetID && item.slug !== targetID,
  )
}

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

  useEffect(() => subscribeCatalogEvents((event) => {
    if (event.type === 'film.created' || event.type === 'film.updated') {
      setFilmItems((current) => upsertFilmItem(current, event.data as ApiFilm))
      return
    }

    if (event.type === 'film.deleted') {
      setFilmItems((current) => removeFilmItem(current, event.data.id))
    }
  }), [])

  useEffect(() => {
    if (selectedSlug && !isLoadingFilms && !selectedFilm) {
      setSelectedSlug(null)
    }
  }, [isLoadingFilms, selectedFilm, selectedSlug])

  return (
    <main className="min-h-dvh bg-[#080205] px-4 pb-5 text-white">
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
