// Foursquare Places API v3 usage example
// Docs: https://developer.foursquare.com/reference/place-search

const FOURSQUARE_KEY = import.meta.env.VITE_FOURSQUARE_KEY
const FS_BASE = 'https://places-api.foursquare.com/v3/places/search'
// 'https://places-api.foursquare.com/v3/places/search'
// https://places-api.foursquare.com/places/search

try {
  
} catch (error) {
  
}
async function fsFetch(params) {
  if (!FOURSQUARE_KEY) throw new Error('Foursquare key missing')
  const url = new URL(FS_BASE)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const r = await fetch(url.toString(), {
    headers: { Authorization: FOURSQUARE_KEY, Accept: 'application/json' },
  })
  if (!r.ok) {
    const body = await r.json().catch(() => ({}))
    throw new Error(body.error || 'Foursquare request failed')
  }
  return r.json()
}

// export async function fetchNearbyPlaces({ lat, lon, query, limit = 8 }) {
//   const ll = `${lat},${lon}`
//   return fsFetch({ ll, query: query || '', limit: String(limit) })
// }

export async function fetchNearbyPlaces({ lat, lon, query, limit }) {
  const url = `/.netlify/functions/foursquare?lat=${lat}&lon=${lon}&query=${query}&limit=${limit}`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchNearbyByCategory({ lat, lon, categories = '', limit = 10 }) {
  const ll = `${lat},${lon}`
  return fsFetch({ ll, categories, limit: String(limit) })
}