const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY
const UNSPLASH_BASE = 'https://api.unsplash.com/search/photos'

export async function fetchPhotos(query, perPage = 8) {
  if (!UNSPLASH_KEY) throw new Error('Unsplash key missing')
  const url = new URL(UNSPLASH_BASE)
  url.searchParams.set('query', query)
  url.searchParams.set('per_page', String(perPage))
  const r = await fetch(url.toString(), {
    headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
  })
  if (!r.ok) throw new Error('Failed to fetch photos')
  const json = await r.json()
  return json.results || []
}

export async function fetchHero(query, perPage = 1) {
  if (!UNSPLASH_KEY) throw new Error('Unsplash key missing')
  const url = new URL(UNSPLASH_BASE)
  url.searchParams.set('query', query)
  url.searchParams.set('per_page', String(perPage))
  const r = await fetch(url.toString(), {
    headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
  })
  if (!r.ok) throw new Error('Failed to fetch photos')
  const json = await r.json()
  const image = json.results && json.results[0];
  if (image && image.urls && image.urls.regular) {
    return image.urls.regular;
  } else {
    return FALLBACK_IMAGE;
  }
}

