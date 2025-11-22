// import React, { useState, useEffect } from 'react'
// import SearchBar from './components/SearchBar'
// import WeatherCard from './components/WeatherCard'
// import PlacesList from './components/PlacesList'
// import PhotoGallery from './components/PhotoGallery'
// import useDebouncedValue from './hooks/useDebouncedValue'
// import { fetchCurrentWeatherByCity, fetchWeatherByCoords } from './api/openWeather'
// import { fetchNearbyPlaces } from './api/foursquare'
// import { fetchPhotos } from './api/unsplash'

// export default function App() {
//   const [query, setQuery] = useState('')
//   const debounced = useDebouncedValue(query, 500)
//   const [units] = useState(import.meta.env.VITE_DEFAULT_UNITS || 'metric')

//   const [weather, setWeather] = useState(null)
//   const [photos, setPhotos] = useState([])
//   const [attractions, setAttractions] = useState([])
//   const [restaurants, setRestaurants] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     // Optional: live suggestions can be implemented here
//   }, [debounced])

//   async function handleSearch(city = query) {
//     if (!city) return
//     setLoading(true)
//     setError(null)
//     try {
//       const w = await fetchCurrentWeatherByCity(city, units)
//       setWeather(w)
//       // fetch photos
//       fetchPhotos(city, 8).then(setPhotos).catch(() => setPhotos([]))

//       // fetch nearby places (use coords)
//             // const lat = w.coord.lat
//             // const lon = w.coord.lon
//       // Attractions: use general query "attraction" or blank to get nearby
//             // const a = await fetchNearbyPlaces({ lat, lon, query: 'attraction', limit: 8 })
//       // Restaurants: query "restaurant"
//           // const r = await fetchNearbyPlaces({ lat, lon, query: 'restaurant', limit: 8 })
//           // setAttractions(a.results || [])
//           // setRestaurants(r.results || [])
//     } catch (err) {
//       setError(err.message)
//       setWeather(null)
//       setAttractions([])
//       setRestaurants([])
//       setPhotos([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen p-6 md:p-12">
//       <header className="max-w-4xl mx-auto mb-6">
//         <h1 className="text-3xl font-bold">City Explorer</h1>
//         <p className="text-slate-600">Search any city to view current weather, attractions, nearby restaurants, and photos.</p>
//       </header>

//       <main className="max-w-4xl mx-auto space-y-6">
//         <SearchBar value={query} onChange={setQuery} onSubmit={() => handleSearch()} />

//         {loading && <div className="text-center text-slate-500">Loading…</div>}
//         {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">{error}</div>}

//         {weather && (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="md:col-span-2 space-y-4">
//               <WeatherCard data={weather} units={units} />
//               <PlacesList title="Attractions" places={attractions} />
//             </div>
//             <div className="space-y-4">
//               <PlacesList title="Restaurants" places={restaurants} />
//               <PhotoGallery photos={photos} />
//             </div>
//           </div>
//         )}

//         <footer className="text-xs text-slate-500 text-center pt-6">
//           Data from OpenWeatherMap, Foursquare Places, and Unsplash. Keys must be provided in environment variables.
//         </footer>
//       </main>
//     </div>
//   )
// }
import React, { useEffect, useState } from "react";

/**
 * City Explorer - single-file dynamic UI using:
 * - OpenWeather (current + 5-day forecast)
 * - Unsplash (city hero image)
 *
 * ENV: import.meta.env.VITE_OPENWEATHER_KEY
 *      import.meta.env.VITE_UNSPLASH_KEY
 *
 * Fallback local hero image (the file you uploaded): /mnt/data/cityScape2.png
 *
 * Paste into src/App.jsx
 */

const FALLBACK_IMAGE = "/mnt/data/cityScape2.png"; // <- developer-provided local path

function kelvinToF(k) {
  return Math.round(((k - 273.15) * 9) / 5 + 32);
}

function formatTemp(t, units) {
  // OpenWeather will already return in chosen units; this is safe passthrough.
  return Math.round(t);
}

function dayShort(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

export default function App() {
  const [city, setCity] = useState("New York");
  const [units] = useState("imperial"); // matching screenshot: °F
  const [weather, setWeather] = useState(null); // current
  const [forecast, setForecast] = useState([]); // parsed 5-day
  const [heroUrl, setHeroUrl] = useState(FALLBACK_IMAGE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const OPENWEATHER_KEY = import.meta.env.VITE_OPENWEATHER_KEY;
  const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY;

  useEffect(() => {
    fetchAll(city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchAll(cityName) {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchWeather(cityName), fetchForecast(cityName), fetchHero(cityName)]);
    } catch (e) {
      console.error(e);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }

  async function fetchWeather(cityName) {
    const unitsParam = units;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      cityName
    )}&units=${unitsParam}&appid=${OPENWEATHER_KEY}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather fetch failed");
    const data = await res.json();
    setWeather(data);
  }

  // Get 5-day forecast (api returns 3-hour slots) and pick a representative temp per day
  async function fetchForecast(cityName) {
    const unitsParam = units;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      cityName
    )}&units=${unitsParam}&appid=${OPENWEATHER_KEY}`;

    const res = await fetch(url);
    if (!res.ok) {
      setForecast([]);
      return;
    }
    const data = await res.json();
    // Group by date (yyyy-mm-dd) and pick midday (12:00) or middle entry
    const grouped = {};
    (data.list || []).forEach((slot) => {
      const date = slot.dt_txt.split(" ")[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(slot);
    });

    const days = Object.keys(grouped)
      .slice(0, 6) // include today + next 5 (we'll show Tue..Sat - choose to skip first if it's today)
      .map((date) => {
        const slots = grouped[date];
        // prefer 12:00 slot
        let chosen = slots.find((s) => s.dt_txt.includes("12:00:00")) || slots[Math.floor(slots.length / 2)];
        return {
          date,
          temp: chosen.main.temp,
          icon: chosen.weather[0].icon,
        };
      });

    // Tailor to show the next 5 days starting from tomorrow
    const todayISO = new Date().toISOString().split("T")[0];
    const filtered = days.filter((d) => d.date !== todayISO).slice(0, 5);
    setForecast(filtered);
  }

  // Unsplash search (uses Authorization Client-ID)
  async function fetchHero(cityName) {
    // Search endpoints: try to use Unsplash API with client id
    const query = encodeURIComponent(`${cityName} skyline city`);
    const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=1`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_KEY}`,
        },
      });
      if (!res.ok) {
        console.warn("Unsplash search failed, using fallback");
        setHeroUrl(FALLBACK_IMAGE);
        return;
      }
      const j = await res.json();
      const image = j.results && j.results[0];
      if (image && image.urls && image.urls.regular) {
        setHeroUrl(image.urls.regular);
      } else {
        setHeroUrl(FALLBACK_IMAGE);
      }
    } catch (e) {
      console.warn("Unsplash fetch error, using fallback", e);
      setHeroUrl(FALLBACK_IMAGE);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    if (!city) return;
    fetchAll(city);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-lg p-5 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-800">City Explorer</h1>
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                aria-label="search"
                className="hidden"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <button
                onClick={() => {
                  const q = prompt("Search city", city);
                  if (q) {
                    setCity(q);
                    fetchAll(q);
                  }
                }}
                type="button"
                className="bg-slate-800 p-3 rounded-full shadow text-white"
                title="Search (click)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
              </button>
            </form>
          </div>

          {/* Hero Image */}
          <div className="w-full overflow-hidden rounded-2xl h-40">
            <img
              src={heroUrl}
              alt={`${city} hero`}
              className="w-full h-full object-cover"
              onError={() => setHeroUrl(FALLBACK_IMAGE)}
            />
          </div>

          {/* Weather card */}
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-slate-700 font-semibold text-lg">{weather?.name || city}</div>
                <div className="flex items-baseline space-x-3 mt-2">
                  <div className="text-4xl font-bold text-slate-800">
                    {weather ? `${formatTemp(weather.main.temp, units)}°${units === "imperial" ? "F" : "C"}` : "--"}
                  </div>
                  <div className="text-sm text-slate-500">{/* optional small subtitle */}</div>
                </div>
              </div>

              <div className="text-right">
                {weather ? (
                  <>
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                      alt={weather.weather[0].description}
                      className="w-16 h-16"
                    />
                    <div className="text-sm text-slate-500 mt-1">{weather.weather[0].description}</div>
                  </>
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded" />
                )}
              </div>
            </div>

            {/* Forecast row */}
            <div className="mt-4 border-t pt-3">
              <div className="flex justify-between">
                {forecast.length > 0 ? (
                  forecast.map((d) => (
                    <div key={d.date} className="flex flex-col items-center text-center">
                      <div className="text-xs text-slate-500">{dayShort(d.date)}</div>
                      <img
                        src={`https://openweathermap.org/img/wn/${d.icon}@2x.png`}
                        alt=""
                        className="w-8 h-8"
                      />
                      <div className="text-sm font-medium text-slate-700">{Math.round(d.temp)}°</div>
                    </div>
                  ))
                ) : (
                  // placeholder skeletons if no forecast
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="text-xs text-slate-400">--</div>
                      <div className="w-8 h-8 bg-gray-200 rounded" />
                      <div className="text-sm text-slate-400">--°</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Popular places */}
          <div>
            <h3 className="text-md font-semibold text-slate-700 mb-3">Popular Places</h3>
            <div className="grid grid-cols-2 gap-3">
              <PlaceCard title="Central Park" query={`${city} park`} unsplashKey={UNSPLASH_KEY} />
              <PlaceCard title="Restaurant" query={`${city} restaurant interior`} unsplashKey={UNSPLASH_KEY} />
            </div>
          </div>

          {/* Footer small status */}
          <div className="text-xs text-slate-400 text-center">
            {loading ? "Loading…" : error ? `Error: ${error}` : "Data from OpenWeather & Unsplash"}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Small place card that searches Unsplash for a single image; falls back to snapshot local image */
function PlaceCard({ title, query, unsplashKey }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1`,
          {
            headers: {
              Authorization: `Client-ID ${unsplashKey}`,
            },
          }
        );
        if (!res.ok) throw new Error("unsplash fail");
        const j = await res.json();
        const image = j.results && j.results[0];
        if (!canceled) setUrl(image ? image.urls.small : FALLBACK_IMAGE);
      } catch (e) {
        if (!canceled) setUrl(FALLBACK_IMAGE);
      }
    })();
    return () => {
      canceled = true;
    };
  }, [query, unsplashKey]);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      <div className="h-24 w-full overflow-hidden">
        <img
          src={url || FALLBACK_IMAGE}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
        />
      </div>
      <div className="p-2 text-center text-sm font-medium text-slate-700">{title}</div>
    </div>
  );
}
