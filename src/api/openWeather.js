const OPENWEATHER_KEY = import.meta.env.VITE_OPENWEATHER_KEY
const DEFAULT_UNITS = import.meta.env.VITE_DEFAULT_UNITS || 'metric'

export async function fetchCurrentWeatherByCity(city, units = DEFAULT_UNITS) {
  if (!OPENWEATHER_KEY) throw new Error('OpenWeather key missing')
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${OPENWEATHER_KEY}`
  const r = await fetch(url)
  if (!r.ok) {
    const body = await r.json().catch(() => ({}))
    throw new Error(body.message || 'Failed to load weather')
  }
  return r.json()
}

export async function fetchWeatherByCoords(lat, lon, units = DEFAULT_UNITS) {
  if (!OPENWEATHER_KEY) throw new Error('OpenWeather key missing')
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${OPENWEATHER_KEY}`
  const r = await fetch(url)
  if (!r.ok) throw new Error('Failed to load weather by coords')
  return r.json()
}
