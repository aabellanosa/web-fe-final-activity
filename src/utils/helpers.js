export function formatTemperature(temp, units = 'metric') {
  return units === 'metric' ? `${Math.round(temp)}°C` : `${Math.round(temp)}°F`
}

export function shortDesc(str) {
  if (!str) return ''
  return str.length > 120 ? str.slice(0, 117) + '...' : str
}
