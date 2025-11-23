import React, { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'
import PlacesList from './components/PlacesList'
import PhotoGallery from './components/PhotoGallery'
import useDebouncedValue from './hooks/useDebouncedValue'
import { fetchCurrentWeatherByCity, fetchWeatherByCoords } from './api/openWeather'
import { fetchNearbyPlaces } from './api/opentripmap'
import { fetchPhotos, fetchHero } from './api/unsplash'

const FALLBACK_IMAGE = "./hero_optim.png";

export default function App() {
  const [query, setQuery] = useState('')
  const debounced = useDebouncedValue(query, 500)
  const [units] = useState(import.meta.env.VITE_DEFAULT_UNITS || 'metric')

  const [weather, setWeather] = useState(null)
  const [photos, setPhotos] = useState([])
  const [attractions, setAttractions] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [heroUrl, setHeroUrl] = useState(FALLBACK_IMAGE);
  const [city, setCity] = useState("New York");

  useEffect(() => {
    // Optional: live suggestions can be implemented here
  }, [debounced])

  async function handleSearch(city = query) {
    if (!city) return
    setLoading(true)
    setError(null)
    try {
      const w = await fetchCurrentWeatherByCity(city, units)
      setWeather(w)
      // fetch photos and hero
      fetchPhotos(city, 8).then(setPhotos).catch(() => setPhotos([]))
      fetchHero(city, 1).then(url => setHeroUrl(url));

      // fetch nearby places (use coords)
            const lat = w.coord.lat
            const lon = w.coord.lon
      // Attractions: use general query "attraction" or blank to get nearby
            const a = await fetchNearbyPlaces({ 
              lat, 
              lon, 
              kinds: 'interesting_places', 
              limit: 8,
              radius: 10000
            });
      // Restaurants: query "restaurant"
          const r = await fetchNearbyPlaces({ 
            lat, 
            lon, 
            kinds: 'restaurants', 
            limit: 8,
            radius: 10000 
          });
          setAttractions(a.results || [])
          setRestaurants(r.results || [])
    } catch (err) {
      setError(err.message)
      setWeather(null)
      setAttractions([])
      setRestaurants([])
      setPhotos([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-6 md:p-12">
      <header className="max-w-4xl mx-auto mb-6">
        <h1 className="text-3xl font-bold">City Explorer</h1>
        <p className="text-slate-600">Search any city to view current weather, attractions, nearby restaurants, and photos.</p>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">
        <SearchBar value={query} onChange={setQuery} onSubmit={() => handleSearch()} />

        {loading && <div className="text-center text-slate-500">Loading…</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">{error}</div>}

        {weather && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-3">
              <img 
                className="w-full h-48 object-cover rounded-xl" 
                src={heroUrl}
                alt={`${city} hero`}
                onError={() => setHeroUrl(FALLBACK_IMAGE)}
                 />
            </div>
            <div className="md:col-span-2 space-y-4">
              <WeatherCard data={weather} units={units} />
              <PlacesList title="Attractions" places={attractions} />
            </div>
            <div className="space-y-4">
              <PlacesList title="Restaurants" places={restaurants} />
              <PhotoGallery photos={photos} />
            </div>
          </div>
        )}

        <footer className="text-xs text-slate-500 text-center pt-6">
          Data from OpenWeatherMap, Foursquare Places, and Unsplash. Keys must be provided in environment variables.
        </footer>
      </main>
    </div>
  )
}
